// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/PreshotBadges.sol";
import "../src/PreshotCredentials.sol";

contract PreshotCredentialsTest is Test {
    PreshotBadges public badges;
    PreshotCredentials public credentials;
    
    address public admin;
    address public aiSubmitter;
    address public user1;
    address public user2;
    
    uint256 public user1PrivateKey = 0xA11CE;
    uint256 public user2PrivateKey = 0xB0B;
    
    // Events
    event DataSubmitted(address indexed user, string ipfsUrl, uint256 timestamp, uint256 readinessScore);
    event BadgeMinted(address indexed user, uint256 badgeType, string reason);
    event ReadinessScoreUpdated(address indexed user, uint256 oldScore, uint256 newScore);
    event DataRevoked(address indexed user, uint256 index, string revokedUrl);

    function setUp() public {
        admin = address(this);
        aiSubmitter = makeAddr("aiSubmitter");
        user1 = vm.addr(user1PrivateKey);
        user2 = vm.addr(user2PrivateKey);
        
        // Deploy contracts
        badges = new PreshotBadges();
        credentials = new PreshotCredentials(address(badges));
        
        // Grant roles
        credentials.grantAISubmitterRole(aiSubmitter);
        badges.grantMinterRole(address(credentials));
    }

    // ========== DIRECT SUBMISSION TESTS ==========
    
    function testSubmitData() public {
        vm.prank(user1);
        vm.expectEmit(true, false, false, true);
        emit DataSubmitted(user1, "ipfs://test1", block.timestamp, 50);
        credentials.submitData("ipfs://test1", 50);
        
        assertEq(credentials.readinessScores(user1), 50);
        assertEq(credentials.getAssessmentCount(user1), 1);
        assertTrue(credentials.hasBeenAssessed(user1));
    }
    
    function testSubmitDataAutoMintsBadge() public {
        vm.prank(user1);
        credentials.submitData("ipfs://test1", 50);
        
        // Should auto-mint ASSESSED badge
        assertTrue(badges.hasBadge(user1, 1));
    }
    
    function testSubmitDataHighScoreMintsReadyBadge() public {
        vm.prank(user1);
        credentials.submitData("ipfs://test1", 75);
        
        // Should auto-mint both ASSESSED and READY badges
        assertTrue(badges.hasBadge(user1, 1));
        assertTrue(badges.hasBadge(user1, 2));
    }
    
    function testCannotSubmitEmptyIPFS() public {
        vm.prank(user1);
        vm.expectRevert("IPFS URL cannot be empty");
        credentials.submitData("", 50);
    }
    
    function testCannotSubmitInvalidScore() public {
        vm.prank(user1);
        vm.expectRevert("Score must be 0-100");
        credentials.submitData("ipfs://test1", 101);
    }

    // ========== SIGNATURE SUBMISSION TESTS ==========
    
    function testSubmitWithSignature() public {
        string memory ipfs = "ipfs://test1";
        uint256 score = 60;
        uint256 region = 1; // Africa
        uint256 nonce = credentials.userNonces(user1);
        
        // Create signature
        bytes32 messageHash = keccak256(
            abi.encodePacked(user1, ipfs, score, region, nonce)
        );
        bytes32 ethSignedHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(user1PrivateKey, ethSignedHash);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        vm.prank(aiSubmitter);
        credentials.submitWithSignature(user1, ipfs, score, region, signature);
        
        assertEq(credentials.readinessScores(user1), score);
        assertEq(credentials.userNonces(user1), nonce + 1);
    }
    
    function testSubmitWithSignatureMintsRegionalBadge() public {
        string memory ipfs = "ipfs://test1";
        uint256 score = 75;
        uint256 region = 1; // Africa
        uint256 nonce = credentials.userNonces(user1);
        
        bytes32 messageHash = keccak256(
            abi.encodePacked(user1, ipfs, score, region, nonce)
        );
        bytes32 ethSignedHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(user1PrivateKey, ethSignedHash);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        vm.prank(aiSubmitter);
        credentials.submitWithSignature(user1, ipfs, score, region, signature);
        
        // Check badge has correct region
        uint256 tokenId = 1; // First minted badge
        assertEq(badges.tokenRegion(tokenId), region);
    }
    
    function testCannotSubmitWithInvalidSignature() public {
        string memory ipfs = "ipfs://test1";
        uint256 score = 60;
        uint256 region = 0;
        uint256 nonce = credentials.userNonces(user1);
        
        // Create signature with wrong private key
        bytes32 messageHash = keccak256(
            abi.encodePacked(user1, ipfs, score, region, nonce)
        );
        bytes32 ethSignedHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(user2PrivateKey, ethSignedHash);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        vm.prank(aiSubmitter);
        vm.expectRevert("Invalid signature");
        credentials.submitWithSignature(user1, ipfs, score, region, signature);
    }
    
    function testCannotReplaySignature() public {
        string memory ipfs = "ipfs://test1";
        uint256 score = 60;
        uint256 region = 0;
        uint256 nonce = credentials.userNonces(user1);
        
        bytes32 messageHash = keccak256(
            abi.encodePacked(user1, ipfs, score, region, nonce)
        );
        bytes32 ethSignedHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(user1PrivateKey, ethSignedHash);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        vm.prank(aiSubmitter);
        credentials.submitWithSignature(user1, ipfs, score, region, signature);
        
        // Try to replay same signature (nonce changed)
        vm.prank(aiSubmitter);
        vm.expectRevert("Invalid signature");
        credentials.submitWithSignature(user1, ipfs, score, region, signature);
    }
    
    function testCannotSubmitWithSignatureWithoutRole() public {
        string memory ipfs = "ipfs://test1";
        uint256 score = 60;
        uint256 region = 0;
        uint256 nonce = credentials.userNonces(user1);
        
        bytes32 messageHash = keccak256(
            abi.encodePacked(user1, ipfs, score, region, nonce)
        );
        bytes32 ethSignedHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(user1PrivateKey, ethSignedHash);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        vm.prank(user2);
        vm.expectRevert();
        credentials.submitWithSignature(user1, ipfs, score, region, signature);
    }

    // ========== COURSE COMPLETION TESTS ==========
    
    function testRecordCourseCompletion() public {
        vm.prank(aiSubmitter);
        credentials.recordCourseCompletion(user1, 0);
        
        assertEq(credentials.completedCourses(user1), 1);
    }
    
    function testThreeCoursesMintsCertifiedBadge() public {
        vm.startPrank(aiSubmitter);
        credentials.recordCourseCompletion(user1, 0);
        credentials.recordCourseCompletion(user1, 0);
        credentials.recordCourseCompletion(user1, 0);
        vm.stopPrank();
        
        assertEq(credentials.completedCourses(user1), 3);
        assertTrue(badges.hasBadge(user1, 3));
    }

    // ========== DATA REVOCATION TESTS ==========
    
    function testRevokeData() public {
        vm.prank(user1);
        credentials.submitData("ipfs://test1", 50);
        
        vm.prank(user1);
        credentials.submitData("ipfs://test2", 60);
        
        assertEq(credentials.getAssessmentCount(user1), 2);
        
        vm.expectEmit(true, false, false, true);
        emit DataRevoked(user1, 0, "ipfs://test1");
        credentials.revokeData(user1, 0);
        
        assertEq(credentials.getAssessmentCount(user1), 1);
        assertEq(credentials.getLatestData(user1), "ipfs://test2");
    }
    
    function testRevokeLastDataResetsScore() public {
        vm.prank(user1);
        credentials.submitData("ipfs://test1", 50);
        
        credentials.revokeData(user1, 0);
        
        assertEq(credentials.readinessScores(user1), 0);
        assertFalse(credentials.hasBeenAssessed(user1));
    }
    
    function testCannotRevokeInvalidIndex() public {
        vm.prank(user1);
        credentials.submitData("ipfs://test1", 50);
        
        vm.expectRevert("Invalid index");
        credentials.revokeData(user1, 5);
    }

    // ========== VIEW FUNCTION TESTS ==========
    
    function testGetUserData() public {
        vm.startPrank(user1);
        credentials.submitData("ipfs://test1", 50);
        credentials.submitData("ipfs://test2", 60);
        credentials.submitData("ipfs://test3", 70);
        vm.stopPrank();
        
        string[] memory data = credentials.getUserData(user1);
        assertEq(data.length, 3);
        assertEq(data[0], "ipfs://test1");
        assertEq(data[1], "ipfs://test2");
        assertEq(data[2], "ipfs://test3");
    }
    
    function testGetLatestData() public {
        vm.startPrank(user1);
        credentials.submitData("ipfs://test1", 50);
        credentials.submitData("ipfs://test2", 60);
        vm.stopPrank();
        
        assertEq(credentials.getLatestData(user1), "ipfs://test2");
    }
    
    function testGetLatestDataEmpty() public {
        assertEq(credentials.getLatestData(user1), "");
    }
    
    function testGetReadinessScore() public {
        vm.prank(user1);
        credentials.submitData("ipfs://test1", 85);
        
        assertEq(credentials.getReadinessScore(user1), 85);
    }

    // ========== ADMIN FUNCTION TESTS ==========
    
    function testUpdateBadgesContract() public {
        PreshotBadges newBadges = new PreshotBadges();
        credentials.updateBadgesContract(address(newBadges));
        
        assertEq(address(credentials.badgesContract()), address(newBadges));
    }
    
    function testGrantAndRevokeAIRole() public {
        address newAI = makeAddr("newAI");
        
        credentials.grantAISubmitterRole(newAI);
        
        // Should be able to submit
        string memory ipfs = "ipfs://test1";
        uint256 score = 60;
        uint256 region = 0;
        uint256 nonce = credentials.userNonces(user1);
        
        bytes32 messageHash = keccak256(
            abi.encodePacked(user1, ipfs, score, region, nonce)
        );
        bytes32 ethSignedHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(user1PrivateKey, ethSignedHash);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        vm.prank(newAI);
        credentials.submitWithSignature(user1, ipfs, score, region, signature);
        assertTrue(credentials.hasBeenAssessed(user1));
        
        // Revoke role
        credentials.revokeAISubmitterRole(newAI);
        
        vm.prank(newAI);
        vm.expectRevert();
        credentials.recordCourseCompletion(user1, 0);
    }

    // ========== PAUSABLE TESTS ==========
    
    function testPause() public {
        credentials.pause();
        
        vm.prank(user1);
        vm.expectRevert();
        credentials.submitData("ipfs://test1", 50);
    }
    
    function testUnpause() public {
        credentials.pause();
        credentials.unpause();
        
        vm.prank(user1);
        credentials.submitData("ipfs://test1", 50);
        assertTrue(credentials.hasBeenAssessed(user1));
    }
    
    function testCannotPauseWithoutRole() public {
        vm.prank(user1);
        vm.expectRevert();
        credentials.pause();
    }

    // ========== INTEGRATION TESTS ==========
    
    function testFullUserJourney() public {
        // User submits first assessment
        vm.prank(user1);
        credentials.submitData("ipfs://assessment1", 50);
        assertTrue(badges.hasBadge(user1, 1)); // ASSESSED badge
        
        // User improves and submits high score
        vm.prank(user1);
        credentials.submitData("ipfs://assessment2", 75);
        assertTrue(badges.hasBadge(user1, 2)); // READY badge
        
        // User completes courses
        vm.startPrank(aiSubmitter);
        credentials.recordCourseCompletion(user1, 0);
        credentials.recordCourseCompletion(user1, 0);
        credentials.recordCourseCompletion(user1, 0);
        vm.stopPrank();
        assertTrue(badges.hasBadge(user1, 3)); // CERTIFIED badge
        
        // Verify user has all 3 badges
        uint256[] memory userBadges = badges.getUserBadges(user1);
        assertEq(userBadges.length, 3);
    }
    
    function testAISubmissionWithRegion() public {
        string memory ipfs = "ipfs://ai-assessment";
        uint256 score = 80;
        uint256 region = 2; // Asia
        uint256 nonce = credentials.userNonces(user1);
        
        bytes32 messageHash = keccak256(
            abi.encodePacked(user1, ipfs, score, region, nonce)
        );
        bytes32 ethSignedHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(user1PrivateKey, ethSignedHash);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        vm.prank(aiSubmitter);
        credentials.submitWithSignature(user1, ipfs, score, region, signature);
        
        // Check badges have Asia region
        uint256[] memory userBadges = badges.getUserBadges(user1);
        for (uint256 i = 0; i < userBadges.length; i++) {
            uint256 tokenId = i + 1;
            assertEq(badges.tokenRegion(tokenId), region);
        }
    }
}
