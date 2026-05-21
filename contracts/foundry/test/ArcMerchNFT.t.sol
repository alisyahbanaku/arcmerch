// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/ArcMerchNFT.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockUSDC
 * @notice Mock USDC for testing (6 decimals)
 */
contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "mUSDC") {}

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

/**
 * @title ArcMerchNFTTest
 */
contract ArcMerchNFTTest is Test {
    ArcMerchNFT public nft;
    MockUSDC public usdc;

    address public owner = makeAddr("owner");
    address public creator = makeAddr("creator");
    address public buyer = makeAddr("buyer");
    address public treasury = makeAddr("treasury");

    uint256 public mintPrice = 5 * 1e6; // 5 USDC

    function setUp() public {
        vm.startPrank(owner);

        usdc = new MockUSDC();
        nft = new ArcMerchNFT(
            address(usdc),
            treasury,
            mintPrice
        );

        vm.stopPrank();

        // Fund creator and buyer with USDC
        usdc.mint(creator, 1000 * 1e6);
        usdc.mint(buyer, 1000 * 1e6);

        // Approve NFT contract
        vm.prank(creator);
        usdc.approve(address(nft), type(uint256).max);
        vm.prank(buyer);
        usdc.approve(address(nft), type(uint256).max);
    }

    // ── Mint Tests ─────────────────────────────────────────

    function test_mint_basic() public {
        vm.prank(creator);

        uint256 tokenId = nft.mint(
            "ipfs://QmTest123",
            "tshirt",
            "Neon Samurai",
            10,
            creator
        );

        assertEq(tokenId, 1);
        assertEq(nft.ownerOf(1), creator);
        assertEq(nft.tokenCreator(1), creator);
        assertEq(nft.totalMinted(), 1);
        assertTrue(nft.isOriginal(1));

        // Check edition info
        (uint256 maxEd, uint256 mintedEd, string memory product, string memory title, address cr) = nft.getEditionInfo(1);
        assertEq(maxEd, 10);
        assertEq(mintedEd, 1);
        assertEq(product, "tshirt");
        assertEq(title, "Neon Samurai");
        assertEq(cr, creator);
    }

    function test_mint_payment() public {
        uint256 creatorBalBefore = usdc.balanceOf(creator);
        uint256 treasuryBalBefore = usdc.balanceOf(treasury);

        vm.prank(creator);
        nft.mint("ipfs://QmTest", "hoodie", "Test", 5, creator);

        assertEq(usdc.balanceOf(creator), creatorBalBefore - mintPrice);
        assertEq(usdc.balanceOf(treasury), treasuryBalBefore + mintPrice);
    }

    function test_mint_editions() public {
        vm.prank(creator);
        uint256 original = nft.mint("ipfs://QmTest", "poster", "Art", 3, creator);

        // Mint 2 more editions
        vm.prank(buyer);
        nft.mintEdition(original, "ipfs://QmTest/2", buyer);

        vm.prank(buyer);
        nft.mintEdition(original, "ipfs://QmTest/3", buyer);

        (, uint256 minted, , , ) = nft.getEditionInfo(original);
        assertEq(minted, 3);
    }

    function test_mint_editions_sold_out() public {
        vm.prank(creator);
        uint256 original = nft.mint("ipfs://QmTest", "poster", "Art", 2, creator);

        vm.prank(buyer);
        nft.mintEdition(original, "ipfs://QmTest/2", buyer);

        // Third edition should revert
        vm.prank(buyer);
        vm.expectRevert("Editions sold out");
        nft.mintEdition(original, "ipfs://QmTest/3", buyer);
    }

    // ── Edition Tree Bug Fix ───────────────────────────────

    function test_mintEdition_rejects_edition_as_parent() public {
        vm.prank(creator);
        uint256 original = nft.mint("ipfs://QmTest", "poster", "Art", 10, creator);

        vm.prank(buyer);
        uint256 editionToken = nft.mintEdition(original, "ipfs://QmTest/2", buyer);

        // Edition token is NOT an original
        assertFalse(nft.isOriginal(editionToken));

        // Trying to use edition as parent should revert
        vm.prank(buyer);
        vm.expectRevert("Not an original token");
        nft.mintEdition(editionToken, "ipfs://QmTest/3", buyer);
    }

    function test_mintEdition_only_original_allowed() public {
        vm.prank(creator);
        nft.mint("ipfs://QmTest", "poster", "Art", 10, creator);

        // Token ID 999 doesn't exist (not original)
        vm.prank(buyer);
        vm.expectRevert("Not an original token");
        nft.mintEdition(999, "ipfs://QmTest/999", buyer);
    }

    // ── Burn Tests ─────────────────────────────────────────

    function test_burn() public {
        vm.prank(creator);
        nft.mint("ipfs://QmTest", "tshirt", "Test", 5, creator);

        vm.prank(creator);
        nft.burn(1);

        // Token should not exist anymore
        vm.expectRevert();
        nft.ownerOf(1);
    }

    function test_burn_only_owner() public {
        vm.prank(creator);
        nft.mint("ipfs://QmTest", "tshirt", "Test", 5, creator);

        vm.prank(buyer);
        vm.expectRevert("Not token owner");
        nft.burn(1);
    }

    // ── Pausable Tests ─────────────────────────────────────

    function test_pause_blocks_mint() public {
        vm.prank(owner);
        nft.pause();

        vm.prank(creator);
        vm.expectRevert();  // EnforcedPause
        nft.mint("ipfs://QmTest", "tshirt", "Test", 5, creator);
    }

    function test_pause_blocks_mintEdition() public {
        vm.prank(creator);
        uint256 original = nft.mint("ipfs://QmTest", "poster", "Art", 10, creator);

        vm.prank(owner);
        nft.pause();

        vm.prank(buyer);
        vm.expectRevert();  // EnforcedPause
        nft.mintEdition(original, "ipfs://QmTest/2", buyer);
    }

    function test_pause_blocks_burn() public {
        vm.prank(creator);
        nft.mint("ipfs://QmTest", "tshirt", "Test", 5, creator);

        vm.prank(owner);
        nft.pause();

        vm.prank(creator);
        vm.expectRevert();  // EnforcedPause
        nft.burn(1);
    }

    function test_unpause_restores_mint() public {
        vm.prank(owner);
        nft.pause();

        vm.prank(owner);
        nft.unpause();

        vm.prank(creator);
        uint256 tokenId = nft.mint("ipfs://QmTest", "tshirt", "Test", 5, creator);
        assertEq(tokenId, 1);
    }

    function test_pause_onlyOwner() public {
        vm.prank(creator);
        vm.expectRevert();
        nft.pause();
    }

    function test_unpause_onlyOwner() public {
        vm.prank(owner);
        nft.pause();

        vm.prank(creator);
        vm.expectRevert();
        nft.unpause();
    }

    // ── Admin Tests ────────────────────────────────────────

    function test_setMintPrice() public {
        vm.prank(owner);
        nft.setMintPrice(10 * 1e6);
        assertEq(nft.mintPrice(), 10 * 1e6);
    }

    function test_setMintPrice_onlyOwner() public {
        vm.prank(creator);
        vm.expectRevert();
        nft.setMintPrice(10 * 1e6);
    }

    function test_setTreasury() public {
        address newTreasury = makeAddr("newTreasury");
        vm.prank(owner);
        nft.setTreasury(newTreasury);
        assertEq(nft.treasury(), newTreasury);
    }

    function test_withdrawUSDC() public {
        // Accidentally send USDC to contract
        usdc.mint(address(nft), 100 * 1e6);

        uint256 ownerBalBefore = usdc.balanceOf(owner);
        vm.prank(owner);
        nft.withdrawUSDC(owner);
        assertEq(usdc.balanceOf(owner), ownerBalBefore + 100 * 1e6);
    }

    // ── Edge Cases ─────────────────────────────────────────

    function test_mint_empty_uri_reverts() public {
        vm.prank(creator);
        vm.expectRevert("Empty URI");
        nft.mint("", "tshirt", "Test", 5, creator);
    }

    function test_mint_zero_editions_reverts() public {
        vm.prank(creator);
        vm.expectRevert("Invalid edition count");
        nft.mint("ipfs://QmTest", "tshirt", "Test", 0, creator);
    }
}
