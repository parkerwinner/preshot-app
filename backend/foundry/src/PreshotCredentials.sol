// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

interface IPreshotBadges {
    function mintBadge(address to, uint256 badgeType, uint256 region) external;
}

// PreshotCredentials
// Stores IPFS URLs for user assessment data and achievements
// Supports both direct user submissions and AI-assisted submissions with signatures
contract PreshotCredentials is AccessControl, Pausable {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    // ========== ROLES ==========
    bytes32 public constant AI_SUBMITTER_ROLE = keccak256("AI_SUBMITTER_ROLE");

    // ========== STATE VARIABLES ==========
    // Mapping of user address to array of IPFS URLs (history)
    mapping(address => string[]) public userDataUrls;

    // Mapping of user address to their latest readiness score
    mapping(address => uint256) public readinessScores;

    // Reference to the PreshotBadges NFT contract
    IPreshotBadges public badgesContract;

    // Tracks if a user has been assessed
    mapping(address => bool) public hasBeenAssessed;

    // Tracks completed course count per user
    mapping(address => uint256) public completedCourses;

    // Nonce for signature replay protection per user
    mapping(address => uint256) public userNonces;

    // ========== EVENTS ==========
    event DataSubmitted(
        address indexed user,
        string ipfsUrl,
        uint256 timestamp,
        uint256 readinessScore
    );

    event DataRevoked(
        address indexed user,
        uint256 index,
        string revokedUrl
    );

    event BadgeMinted(
        address indexed user,
        uint256 badgeType,
        string reason
    );

    event ReadinessScoreUpdated(
        address indexed user,
        uint256 oldScore,
        uint256 newScore
    );

    // ========== CONSTRUCTOR ==========
    constructor(address _badgesContract) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        badgesContract = IPreshotBadges(_badgesContract);
    }

    // ========== CORE FUNCTIONS ==========
    // Submit assessment data directly (user only)
    // ipfsUrl The IPFS URL containing the assessment data (non-empty)
    // readinessScore The calculated readiness score (0-100)
    function submitData(string memory ipfsUrl, uint256 readinessScore) external whenNotPaused {
        require(bytes(ipfsUrl).length > 0, "IPFS URL cannot be empty");
        require(readinessScore <= 100, "Score must be 0-100");

        _storeData(msg.sender, ipfsUrl, readinessScore);
    }

    // AI submits data on behalf of user with their signature (AI role only)
    // user The user's address
    // ipfsUrl The IPFS URL containing the assessment data (non-empty)
    // readinessScore The calculated readiness score (0-100)
    // region The user's region for badge minting (0-2)
    // signature The user's signature authorizing the submission (includes nonce)
    function submitWithSignature(
        address user,
        string memory ipfsUrl,
        uint256 readinessScore,
        uint256 region,
        bytes memory signature
    ) external onlyRole(AI_SUBMITTER_ROLE) whenNotPaused {
        require(bytes(ipfsUrl).length > 0, "IPFS URL cannot be empty");
        require(readinessScore <= 100, "Score must be 0-100");
        require(region <= 2, "Invalid region");

        uint256 nonce = userNonces[user];

        // Verify signature with nonce
        bytes32 messageHash = keccak256(
            abi.encodePacked(user, ipfsUrl, readinessScore, region, nonce)
        );
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        address signer = ethSignedMessageHash.recover(signature);

        require(signer == user, "Invalid signature");

        // Increment nonce to prevent replay
        userNonces[user]++;

        _storeData(user, ipfsUrl, readinessScore, region);
    }

    // Internal function to store data and mint badges
    // user The user's address
    // ipfsUrl The IPFS URL
    // readinessScore The readiness score
    // region The region for badge minting (default 0 if not provided)
    function _storeData(
        address user,
        string memory ipfsUrl,
        uint256 readinessScore,
        uint256 region
    ) private {
        uint256 oldScore = readinessScores[user];

        // Store data
        userDataUrls[user].push(ipfsUrl);
        readinessScores[user] = readinessScore;

        emit DataSubmitted(user, ipfsUrl, block.timestamp, readinessScore);
        emit ReadinessScoreUpdated(user, oldScore, readinessScore);

        // Auto-mint badges based on achievements
        _checkAndMintBadges(user, readinessScore, region);
    }

    // Overloaded _storeData for direct submit (default region 0)
    function _storeData(
        address user,
        string memory ipfsUrl,
        uint256 readinessScore
    ) private {
        _storeData(user, ipfsUrl, readinessScore, 0); // Default global region
    }

    // Check if user qualifies for badges and mint them
    // user The user's address
    // readinessScore The current readiness score
    // region The region for the badge
    function _checkAndMintBadges(address user, uint256 readinessScore, uint256 region) private {
        try badgesContract.mintBadge(user, 1, region) {} catch {} // Suppress errors

        // Badge Type 1: ASSESSED - First assessment completed
        if (!hasBeenAssessed[user]) {
            hasBeenAssessed[user] = true;
            try badgesContract.mintBadge(user, 1, region) {
                emit BadgeMinted(user, 1, "Completed first assessment");
            } catch {} // Suppress if fails (e.g., already minted)
        }

        // Badge Type 2: READY - Achieved 70+ readiness score
        if (readinessScore >= 70) {
            try badgesContract.mintBadge(user, 2, region) {
                emit BadgeMinted(user, 2, "Achieved 70+ readiness score");
            } catch {}
        }

        // Badge Type 3: CERTIFIED - Completed 3+ courses
        if (completedCourses[user] >= 3) {
            try badgesContract.mintBadge(user, 3, region) {
                emit BadgeMinted(user, 3, "Completed 3+ mindset courses");
            } catch {}
        }
    }

    // Record course completion (admin or AI role)
    // user The user's address
    // region The region for potential badge minting
    function recordCourseCompletion(address user, uint256 region) external onlyRole(AI_SUBMITTER_ROLE) whenNotPaused {
        completedCourses[user]++;

        // Check if they now qualify for certification badge
        if (completedCourses[user] >= 3) {
            try badgesContract.mintBadge(user, 3, region) {
                emit BadgeMinted(user, 3, "Completed 3+ mindset courses");
            } catch {}
        }
    }

    // Revoke/delete a specific data entry (admin only)
    // user The user's address
    // index The array index to remove (0-based)
    function revokeData(address user, uint256 index) external onlyRole(DEFAULT_ADMIN_ROLE) {
        string[] storage urls = userDataUrls[user];
        require(index < urls.length, "Invalid index");

        string memory revokedUrl = urls[index];

        // Remove by shifting (preserves order)
        for (uint256 i = index; i < urls.length - 1; i++) {
            urls[i] = urls[i + 1];
        }
        urls.pop();

        emit DataRevoked(user, index, revokedUrl);

        // Optionally reset score if latest revoked
        if (urls.length == 0) {
            readinessScores[user] = 0;
            hasBeenAssessed[user] = false;
        }
    }

    // ========== VIEW FUNCTIONS ==========
    // Get all IPFS URLs for a user
    // user The user's address
    function getUserData(address user) external view returns (string[] memory) {
        return userDataUrls[user];
    }

    // Get the latest IPFS URL for a user
    // user The user's address
    function getLatestData(address user) external view returns (string memory) {
        string[] memory urls = userDataUrls[user];
        if (urls.length == 0) {
            return "";
        }
        return urls[urls.length - 1];
    }

    // Get user's current readiness score
    // user The user's address
    function getReadinessScore(address user) external view returns (uint256) {
        return readinessScores[user];
    }

    // Get total number of assessments for a user
    // user The user's address
    function getAssessmentCount(address user) external view returns (uint256) {
        return userDataUrls[user].length;
    }

    // Get historical readiness score (assumes scores align with URL array indices)
    // user The user's address
    // index The assessment index
    // Note: This requires off-chain tracking or additional mapping; for simplicity, assume latest is only stored, but add if needed
    // function getHistoricalScore(address user, uint256 index) external view returns (uint256) {
    //     // Implement if you add historical scores mapping
    // }

    // ========== ADMIN FUNCTIONS ==========
    // Update the badges contract address
    // _badgesContract New badges contract address
    function updateBadgesContract(address _badgesContract) external onlyRole(DEFAULT_ADMIN_ROLE) {
        badgesContract = IPreshotBadges(_badgesContract);
    }

    // Grant AI submitter role
    // submitter The AI address
    function grantAISubmitterRole(address submitter) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(AI_SUBMITTER_ROLE, submitter);
    }

    // Revoke AI submitter role
    // submitter The AI address
    function revokeAISubmitterRole(address submitter) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(AI_SUBMITTER_ROLE, submitter);
    }

    // Pause the contract
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    // Unpause the contract
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    // ========== OVERRIDES ==========
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}