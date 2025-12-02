// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// PreshotBadges
// ERC-721 NFT badges for Preshot achievements
// Mints soul-bound tokens (non-transferable) for user milestones
// Supports region-based metadata (Africa, Asia, Global)
contract PreshotBadges is ERC721, AccessControl, Pausable {
    using Strings for uint256;

    // ========== ROLES ==========
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // ========== STATE VARIABLES ==========
    // Counter for token IDs (starts from 1)
    uint256 private _tokenIdCounter = 1;

    // Base URI for metadata (your Pinata IPFS CID)
    string private _baseTokenURI = "ipfs://bafybeifiqkgdgq2ctopeldctg6p62i3nxxq677mfahqjr5ofmsuhya4fbe/";

    // Mapping of user address to badge types they own
    mapping(address => mapping(uint256 => bool)) public hasBadge;

    // Mapping of token ID to badge type
    mapping(uint256 => uint256) public tokenBadgeType;

    // Mapping of token ID to region (0=Global, 1=Africa, 2=Asia)
    mapping(uint256 => uint256) public tokenRegion;

    // Dynamic badge types (starts with 3; admin can add more)
    uint256 public nextBadgeType = 4; // After initial 1-3
    uint256 public constant MAX_BADGE_TYPES = 10; // Limit for safety

    // ========== BADGE TYPES (Initial) ==========
    uint256 public constant BADGE_ASSESSED = 1; // First assessment completed
    uint256 public constant BADGE_READY = 2; // 70+ readiness score
    uint256 public constant BADGE_CERTIFIED = 3; // 3+ courses completed

    // ========== REGION TYPES ==========
    uint256 public constant REGION_GLOBAL = 0;
    uint256 public constant REGION_AFRICA = 1;
    uint256 public constant REGION_ASIA = 2;

    // ========== EVENTS ==========
    event BadgeMinted(address indexed to, uint256 tokenId, uint256 badgeType, uint256 region);
    event BadgeBurned(uint256 tokenId);
    event BadgeTypeAdded(uint256 newType);

    // ========== CONSTRUCTOR ==========
    constructor() ERC721("Preshot Achievement Badges", "PRESHOT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    // ========== MINTING FUNCTIONS ==========
    // Mint a badge for a user with region support
    // to The recipient address
    // badgeType The type of badge (1+)
    // region The user's region (0=Global, 1=Africa, 2=Asia)
    function mintBadge(address to, uint256 badgeType, uint256 region) external onlyRole(MINTER_ROLE) whenNotPaused {
        require(badgeType >= 1 && badgeType < nextBadgeType, "Invalid badge type");
        require(region <= 2, "Invalid region");
        require(!hasBadge[to][badgeType], "User already has this badge");

        uint256 tokenId = _tokenIdCounter++;

        _safeMint(to, tokenId);

        hasBadge[to][badgeType] = true;
        tokenBadgeType[tokenId] = badgeType;
        tokenRegion[tokenId] = region;

        emit BadgeMinted(to, tokenId, badgeType, region);
    }

    // Batch mint multiple badges for a user
    // to The recipient
    // badgeTypes Array of badge types
    // region Single region for all badges
    function batchMintBadges(address to, uint256[] calldata badgeTypes, uint256 region) external onlyRole(MINTER_ROLE) whenNotPaused {
        require(badgeTypes.length <= 5, "Too many in batch"); // Gas limit
        require(region <= 2, "Invalid region");

        for (uint256 i = 0; i < badgeTypes.length; i++) {
            uint256 badgeType = badgeTypes[i];
            require(badgeType >= 1 && badgeType < nextBadgeType, "Invalid badge type");
            require(!hasBadge[to][badgeType], "User already has this badge");

            uint256 tokenId = _tokenIdCounter++;

            _safeMint(to, tokenId);

            hasBadge[to][badgeType] = true;
            tokenBadgeType[tokenId] = badgeType;
            tokenRegion[tokenId] = region;

            emit BadgeMinted(to, tokenId, badgeType, region);
        }
    }

    // Add a new badge type (admin only)
    function addBadgeType() external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(nextBadgeType < MAX_BADGE_TYPES, "Max badge types reached");
        uint256 newType = nextBadgeType++;
        emit BadgeTypeAdded(newType);
    }

    // ========== BURN FUNCTION (ADMIN ONLY) ==========
    // Burn a badge (e.g., for errors or revocations)
    // tokenId The token ID to burn
    function burnBadge(uint256 tokenId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        address owner = ownerOf(tokenId);
        uint256 badgeType = tokenBadgeType[tokenId];

        _burn(tokenId);

        hasBadge[owner][badgeType] = false;
        delete tokenBadgeType[tokenId];
        delete tokenRegion[tokenId];

        emit BadgeBurned(tokenId);
    }

    // ========== OVERRIDE TRANSFER (SOUL-BOUND) ==========
    // Override transfer to make badges non-transferable (soul-bound)
    // Reverts all transfers except minting and burning
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);

        // Allow minting (from == address(0)) and burning (to == address(0))
        // Block all other transfers
        if (from != address(0) && to != address(0)) {
            revert("Preshot badges are soul-bound and cannot be transferred");
        }

        return super._update(to, tokenId, auth);
    }

    // ========== VIEW FUNCTIONS ==========
    // Get the base URI for token metadata
    // The base URI string
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    // Get the full token URI for a token (dynamic based on region)
    // tokenId The token ID
    // The complete metadata URI (e.g., "1-Africa.json")
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireOwned(tokenId);

        uint256 badgeType = tokenBadgeType[tokenId];
        uint256 region = tokenRegion[tokenId];
        string memory regionSuffix;

        if (region == REGION_AFRICA) {
            regionSuffix = "-Africa";
        } else if (region == REGION_ASIA) {
            regionSuffix = "-Asia";
        } else {
            regionSuffix = ""; // Global/default
        }

        string memory baseURI = _baseURI();

        return string(abi.encodePacked(baseURI, badgeType.toString(), regionSuffix, ".json"));
    }

    // Check if a user has a specific badge type
    // user The user's address
    // badgeType The badge type to check
    // True if user has the badge
    function userHasBadge(address user, uint256 badgeType) external view returns (bool) {
        return hasBadge[user][badgeType];
    }

    // Get badge name from type
    // badgeType The badge type
    // The badge name
    function getBadgeName(uint256 badgeType) external pure returns (string memory) {
        if (badgeType == BADGE_ASSESSED) return "Assessed";
        if (badgeType == BADGE_READY) return "Ready";
        if (badgeType == BADGE_CERTIFIED) return "Certified";
        return "Custom"; // For dynamic types
    }

    // Get all badge types a user owns
    // user The user's address
    // Array of badge types owned
    function getUserBadges(address user) external view returns (uint256[] memory) {
        uint256 count = 0;

        // Count badges
        for (uint256 i = 1; i < nextBadgeType; i++) {
            if (hasBadge[user][i]) {
                count++;
            }
        }

        // Build array
        uint256[] memory badges = new uint256[](count);
        uint256 index = 0;

        for (uint256 i = 1; i < nextBadgeType; i++) {
            if (hasBadge[user][i]) {
                badges[index] = i;
                index++;
            }
        }

        return badges;
    }

    // ========== ADMIN FUNCTIONS ==========
    // Update the base URI for metadata
    // newBaseURI The new base URI
    function setBaseURI(string memory newBaseURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _baseTokenURI = newBaseURI;
    }

    // Grant minter role to an address (e.g., Preshot agent)
    // minter The address to grant minter role
    function grantMinterRole(address minter) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(MINTER_ROLE, minter);
    }

    // Revoke minter role from an address
    // minter The address to revoke
    function revokeMinterRole(address minter) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(MINTER_ROLE, minter);
    }

    // Pause the contract (stops minting)
    // minter The address to grant minter role
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    // Unpause the contract
    // minter The address to grant minter role
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    // ========== REQUIRED OVERRIDES ==========
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
