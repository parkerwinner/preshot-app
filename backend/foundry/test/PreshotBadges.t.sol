// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/PreshotBadges.sol";

contract PreshotBadgesTest is Test {
    PreshotBadges public badges;
    address public admin;
    address public minter;
    address public user1;
    address public user2;

    // Events
    event BadgeMinted(address indexed to, uint256 tokenId, uint256 badgeType, uint256 region);
    event BadgeBurned(uint256 tokenId);
    event BadgeTypeAdded(uint256 newType);

    function setUp() public {
        admin = address(this);
        minter = makeAddr("minter");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        badges = new PreshotBadges();
        badges.grantMinterRole(minter);
    }

    // ========== MINTING TESTS ==========

    function testMintBadge() public {
        vm.prank(minter);
        vm.expectEmit(true, false, false, true);
        emit BadgeMinted(user1, 1, 1, 0);
        badges.mintBadge(user1, 1, 0);

        assertEq(badges.ownerOf(1), user1);
        assertEq(badges.tokenBadgeType(1), 1);
        assertEq(badges.tokenRegion(1), 0);
        assertTrue(badges.hasBadge(user1, 1));
    }

    function testMintBadgeWithDifferentRegions() public {
        vm.startPrank(minter);
        
        // Mint Global badge
        badges.mintBadge(user1, 1, 0);
        assertEq(badges.tokenRegion(1), 0);
        
        // Mint Africa badge
        badges.mintBadge(user1, 2, 1);
        assertEq(badges.tokenRegion(2), 1);
        
        // Mint Asia badge
        badges.mintBadge(user1, 3, 2);
        assertEq(badges.tokenRegion(3), 2);
        
        vm.stopPrank();
    }

    function testCannotMintDuplicateBadgeType() public {
        vm.startPrank(minter);
        badges.mintBadge(user1, 1, 0);
        
        vm.expectRevert("User already has this badge");
        badges.mintBadge(user1, 1, 1); // Same badge type, different region
        vm.stopPrank();
    }

    function testCannotMintInvalidBadgeType() public {
        vm.prank(minter);
        vm.expectRevert("Invalid badge type");
        badges.mintBadge(user1, 0, 0); // Badge type 0 doesn't exist
    }

    function testCannotMintInvalidRegion() public {
        vm.prank(minter);
        vm.expectRevert("Invalid region");
        badges.mintBadge(user1, 1, 3); // Region 3 doesn't exist
    }

    function testCannotMintWithoutRole() public {
        vm.prank(user1);
        vm.expectRevert();
        badges.mintBadge(user2, 1, 0);
    }

    function testTokenIdStartsFromOne() public {
        vm.prank(minter);
        badges.mintBadge(user1, 1, 0);
        
        assertEq(badges.ownerOf(1), user1);
        vm.expectRevert();
        badges.ownerOf(0); // Token 0 should not exist
    }

    // ========== BATCH MINTING TESTS ==========

    function testBatchMintBadges() public {
        uint256[] memory types = new uint256[](3);
        types[0] = 1;
        types[1] = 2;
        types[2] = 3;

        vm.prank(minter);
        badges.batchMintBadges(user1, types, 1);

        assertEq(badges.ownerOf(1), user1);
        assertEq(badges.ownerOf(2), user1);
        assertEq(badges.ownerOf(3), user1);
        
        assertTrue(badges.hasBadge(user1, 1));
        assertTrue(badges.hasBadge(user1, 2));
        assertTrue(badges.hasBadge(user1, 3));
    }

    function testCannotBatchMintTooMany() public {
        uint256[] memory types = new uint256[](6);
        for (uint256 i = 0; i < 6; i++) {
            types[i] = i + 1;
        }

        vm.prank(minter);
        vm.expectRevert("Too many in batch");
        badges.batchMintBadges(user1, types, 0);
    }

    // ========== SOUL-BOUND TESTS ==========

    function testCannotTransferBadge() public {
        vm.prank(minter);
        badges.mintBadge(user1, 1, 0);

        vm.prank(user1);
        vm.expectRevert("Preshot badges are soul-bound and cannot be transferred");
        badges.transferFrom(user1, user2, 1);
    }

    // ========== BURN TESTS ==========

    function testBurnBadge() public {
        vm.prank(minter);
        badges.mintBadge(user1, 1, 0);

        assertTrue(badges.hasBadge(user1, 1));
        
        vm.expectEmit(false, false, false, true);
        emit BadgeBurned(1);
        badges.burnBadge(1);

        assertFalse(badges.hasBadge(user1, 1));
        vm.expectRevert();
        badges.ownerOf(1);
    }

    function testCannotBurnNonexistentBadge() public {
        vm.expectRevert("Token does not exist");
        badges.burnBadge(999);
    }

    function testCannotBurnWithoutAdminRole() public {
        vm.prank(minter);
        badges.mintBadge(user1, 1, 0);

        vm.prank(user1);
        vm.expectRevert();
        badges.burnBadge(1);
    }

    // ========== TOKEN URI TESTS ==========

    function testTokenURIGlobal() public {
        vm.prank(minter);
        badges.mintBadge(user1, 1, 0);

        string memory uri = badges.tokenURI(1);
        string memory expected = "ipfs://bafybeifiqkgdgq2ctopeldctg6p62i3nxxq677mfahqjr5ofmsuhya4fbe/1.json";
        assertEq(uri, expected);
    }

    function testTokenURIAfrica() public {
        vm.prank(minter);
        badges.mintBadge(user1, 1, 1);

        string memory uri = badges.tokenURI(1);
        string memory expected = "ipfs://bafybeifiqkgdgq2ctopeldctg6p62i3nxxq677mfahqjr5ofmsuhya4fbe/1-Africa.json";
        assertEq(uri, expected);
    }

    function testTokenURIAsia() public {
        vm.prank(minter);
        badges.mintBadge(user1, 2, 2);

        string memory uri = badges.tokenURI(1);
        string memory expected = "ipfs://bafybeifiqkgdgq2ctopeldctg6p62i3nxxq677mfahqjr5ofmsuhya4fbe/2-Asia.json";
        assertEq(uri, expected);
    }

    // ========== VIEW FUNCTION TESTS ==========

    function testUserHasBadge() public {
        assertFalse(badges.userHasBadge(user1, 1));

        vm.prank(minter);
        badges.mintBadge(user1, 1, 0);

        assertTrue(badges.userHasBadge(user1, 1));
        assertFalse(badges.userHasBadge(user1, 2));
    }

    function testGetBadgeName() public {
        assertEq(badges.getBadgeName(1), "Assessed");
        assertEq(badges.getBadgeName(2), "Ready");
        assertEq(badges.getBadgeName(3), "Certified");
        assertEq(badges.getBadgeName(4), "Custom");
    }

    function testGetUserBadges() public {
        vm.startPrank(minter);
        badges.mintBadge(user1, 1, 0);
        badges.mintBadge(user1, 3, 1);
        vm.stopPrank();

        uint256[] memory userBadges = badges.getUserBadges(user1);
        assertEq(userBadges.length, 2);
        assertEq(userBadges[0], 1);
        assertEq(userBadges[1], 3);
    }

    function testGetUserBadgesEmpty() public {
        uint256[] memory userBadges = badges.getUserBadges(user1);
        assertEq(userBadges.length, 0);
    }

    // ========== ADMIN FUNCTION TESTS ==========

    function testSetBaseURI() public {
        string memory newURI = "ipfs://newcid/";
        badges.setBaseURI(newURI);

        vm.prank(minter);
        badges.mintBadge(user1, 1, 0);

        string memory uri = badges.tokenURI(1);
        assertEq(uri, "ipfs://newcid/1.json");
    }

    function testAddBadgeType() public {
        vm.expectEmit(false, false, false, true);
        emit BadgeTypeAdded(4);
        badges.addBadgeType();

        // Now badge type 4 should be valid
        vm.prank(minter);
        badges.mintBadge(user1, 4, 0);
        assertTrue(badges.hasBadge(user1, 4));
    }

    function testCannotExceedMaxBadgeTypes() public {
        // Add badge types until we reach the limit
        for (uint256 i = 4; i < 10; i++) {
            badges.addBadgeType();
        }

        vm.expectRevert("Max badge types reached");
        badges.addBadgeType();
    }

    function testGrantAndRevokeMinterRole() public {
        address newMinter = makeAddr("newMinter");
        
        badges.grantMinterRole(newMinter);
        
        vm.prank(newMinter);
        badges.mintBadge(user1, 1, 0);
        assertTrue(badges.hasBadge(user1, 1));

        badges.revokeMinterRole(newMinter);
        
        vm.prank(newMinter);
        vm.expectRevert();
        badges.mintBadge(user2, 1, 0);
    }

    // ========== PAUSABLE TESTS ==========

    function testPause() public {
        badges.pause();

        vm.prank(minter);
        vm.expectRevert();
        badges.mintBadge(user1, 1, 0);
    }

    function testUnpause() public {
        badges.pause();
        badges.unpause();

        vm.prank(minter);
        badges.mintBadge(user1, 1, 0);
        assertTrue(badges.hasBadge(user1, 1));
    }

    function testCannotPauseWithoutAdminRole() public {
        vm.prank(user1);
        vm.expectRevert();
        badges.pause();
    }

    // ========== INTERFACE SUPPORT TESTS ==========

    function testSupportsInterface() public {
        // ERC721
        assertTrue(badges.supportsInterface(0x80ac58cd));
        // AccessControl
        assertTrue(badges.supportsInterface(0x7965db0b));
    }
}
