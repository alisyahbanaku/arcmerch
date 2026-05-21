// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title ArcMerchNFT
 * @notice ERC-721 NFT for AI-generated merchandise on Arc Testnet
 * @dev Mint with USDC payment, burn-to-redeem mechanic, EIP-2981 royalties
 */
contract ArcMerchNFT is ERC721, ERC721URIStorage, ERC721Royalty, Ownable, ReentrancyGuard, Pausable {
    // ── State ──────────────────────────────────────────────────

    IERC20 public immutable usdc;
    address public treasury;

    uint256 public nextTokenId = 1;
    uint256 public maxSupply = 10000;
    uint256 public mintPrice;           // in USDC (6 decimals)

    uint96 public royaltyBps = 500;    // 5% royalty (500 basis points)

    // tokenId => creator address
    mapping(uint256 => address) public tokenCreator;
    // tokenId => edition info
    struct Edition {
        uint256 maxEditions;
        uint256 mintedEditions;
        string  productType;    // "tshirt", "hoodie", "poster", etc.
        string  designTitle;
    }
    mapping(uint256 => Edition) public editions;
    // tokenId => true if this is an original (not an edition copy)
    mapping(uint256 => bool) public isOriginal;

    // ── Events ─────────────────────────────────────────────────

    event Minted(
        uint256 indexed tokenId,
        address indexed creator,
        string tokenURI,
        string productType,
        uint256 edition,
        uint256 price
    );
    event Burned(uint256 indexed tokenId, address indexed burner);
    event PriceUpdated(uint256 oldPrice, uint256 newPrice);
    event TreasuryUpdated(address oldTreasury, address newTreasury);

    // ── Constructor ────────────────────────────────────────────

    constructor(
        address _usdc,
        address _treasury,
        uint256 _mintPrice
    ) ERC721("ArcMerch", "AMERCH") Ownable(msg.sender) {
        require(_usdc != address(0), "Invalid USDC address");
        require(_treasury != address(0), "Invalid treasury address");

        usdc = IERC20(_usdc);
        treasury = _treasury;
        mintPrice = _mintPrice;     // e.g., 5 USDC = 5_000_000 (6 decimals)
    }

    // ── Mint ───────────────────────────────────────────────────

    /**
     * @notice Mint a new ArcMerch NFT
     * @param uri IPFS/Arweave metadata URI
     * @param productType Physical product type (tshirt, hoodie, etc.)
     * @param designTitle Human-readable design title
     * @param maxEditions Maximum editions for this design
     * @param to Recipient address (creator or buyer)
     */
    function mint(
        string calldata uri,
        string calldata productType,
        string calldata designTitle,
        uint256 maxEditions,
        address to
    ) external nonReentrant whenNotPaused returns (uint256) {
        require(nextTokenId <= maxSupply, "Max supply reached");
        require(maxEditions > 0 && maxEditions <= 1000, "Invalid edition count");
        require(bytes(uri).length > 0, "Empty URI");

        // Transfer USDC payment from caller to treasury
        require(
            usdc.transferFrom(msg.sender, treasury, mintPrice),
            "USDC transfer failed"
        );

        uint256 tokenId = nextTokenId++;

        // Mint NFT
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        // Store creator + edition info
        tokenCreator[tokenId] = msg.sender;
        editions[tokenId] = Edition({
            maxEditions: maxEditions,
            mintedEditions: 1,
            productType: productType,
            designTitle: designTitle
        });
        isOriginal[tokenId] = true;

        // Set royalty for this token
        _setTokenRoyalty(tokenId, msg.sender, royaltyBps);

        emit Minted(tokenId, msg.sender, uri, productType, 1, mintPrice);

        return tokenId;
    }

    /**
     * @notice Mint additional edition of existing design
     * @param originalTokenId The first token of this design (must be an original)
     * @param uri IPFS/Arweave metadata URI
     * @param to Recipient address
     */
    function mintEdition(
        uint256 originalTokenId,
        string calldata uri,
        address to
    ) external nonReentrant whenNotPaused returns (uint256) {
        require(nextTokenId <= maxSupply, "Max supply reached");
        require(isOriginal[originalTokenId], "Not an original token");
        require(editions[originalTokenId].mintedEditions > 0, "Original not found");
        require(
            editions[originalTokenId].mintedEditions < editions[originalTokenId].maxEditions,
            "Editions sold out"
        );

        // Transfer USDC payment
        require(
            usdc.transferFrom(msg.sender, treasury, mintPrice),
            "USDC transfer failed"
        );

        uint256 tokenId = nextTokenId++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        // Update edition count on original
        editions[originalTokenId].mintedEditions++;

        // Copy edition info
        uint256 currentMinted = editions[originalTokenId].mintedEditions;
        editions[tokenId] = Edition({
            maxEditions: editions[originalTokenId].maxEditions,
            mintedEditions: currentMinted,
            productType: editions[originalTokenId].productType,
            designTitle: editions[originalTokenId].designTitle
        });
        // isOriginal[tokenId] stays false (default) — edition copies cannot be parents

        // Same creator as original
        address creator = tokenCreator[originalTokenId];
        tokenCreator[tokenId] = creator;
        _setTokenRoyalty(tokenId, creator, royaltyBps);

        emit Minted(tokenId, msg.sender, uri, editions[tokenId].productType, currentMinted, mintPrice);

        return tokenId;
    }

    // ── Burn ───────────────────────────────────────────────────

    /**
     * @notice Burn NFT to redeem physical product
     * @dev Token is permanently destroyed, emits Burned event for fulfillment
     */
    function burn(uint256 tokenId) external nonReentrant whenNotPaused {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        _burn(tokenId);
        emit Burned(tokenId, msg.sender);
    }

    // ── Admin ──────────────────────────────────────────────────

    function setMintPrice(uint256 _price) external onlyOwner {
        emit PriceUpdated(mintPrice, _price);
        mintPrice = _price;
    }

    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid treasury");
        emit TreasuryUpdated(treasury, _treasury);
        treasury = _treasury;
    }

    function setRoyaltyBps(uint96 _bps) external onlyOwner {
        require(_bps <= 1000, "Max 10%");
        royaltyBps = _bps;
    }

    function setMaxSupply(uint256 _max) external onlyOwner {
        require(_max >= nextTokenId - 1, "Cannot reduce below minted");
        maxSupply = _max;
    }

    function withdrawUSDC(address to) external onlyOwner {
        require(to != address(0), "Invalid address");
        uint256 balance = usdc.balanceOf(address(this));
        require(balance > 0, "No USDC to withdraw");
        require(usdc.transfer(to, balance), "Withdraw failed");
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // ── Views ──────────────────────────────────────────────────

    function totalMinted() external view returns (uint256) {
        return nextTokenId - 1;
    }

    function getEditionInfo(uint256 tokenId) external view returns (
        uint256 maxEditions,
        uint256 mintedEditions,
        string memory productType,
        string memory designTitle,
        address creator
    ) {
        Edition storage e = editions[tokenId];
        return (e.maxEditions, e.mintedEditions, e.productType, e.designTitle, tokenCreator[tokenId]);
    }

    // ── Required Overrides ─────────────────────────────────────

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, ERC721Royalty)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
