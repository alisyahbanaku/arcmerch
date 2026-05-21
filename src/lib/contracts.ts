// Contract addresses (Arc Testnet)
export const ARC_MERCH_NFT_ADDRESS = "0x27881c74CF4Db0B361Bc67647046583C6e0f2162" as const;
export const USDC_ADDRESS = "0x3600000000000000000000000000000000000000" as const;
export const TREASURY_ADDRESS = "0x7e860fb6515D8c250d67c26F54D0a3c217cA05Ac" as const;

// Minimal ABI for frontend interactions
export const ARC_MERCH_NFT_ABI = [
  // Read functions
  {
    type: "function",
    name: "name",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "symbol",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "treasury",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "usdc",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "mintPrice",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "maxSupply",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "nextTokenId",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "royaltyBps",
    inputs: [],
    outputs: [{ name: "", type: "uint96" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalMinted",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "ownerOf",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "tokenURI",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "tokenCreator",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "editions",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [
      { name: "maxEditions", type: "uint256" },
      { name: "mintedEditions", type: "uint256" },
      { name: "productType", type: "string" },
      { name: "designTitle", type: "string" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isOriginal",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getEditionInfo",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [
      { name: "maxEditions", type: "uint256" },
      { name: "mintedEditions", type: "uint256" },
      { name: "productType", type: "string" },
      { name: "designTitle", type: "string" },
      { name: "creator", type: "address" },
    ],
    stateMutability: "view",
  },
  // Write functions
  {
    type: "function",
    name: "mint",
    inputs: [
      { name: "uri", type: "string" },
      { name: "productType", type: "string" },
      { name: "designTitle", type: "string" },
      { name: "maxEditions", type: "uint256" },
      { name: "to", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "mintEdition",
    inputs: [
      { name: "originalTokenId", type: "uint256" },
      { name: "uri", type: "string" },
      { name: "to", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "burn",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  // Events
  {
    type: "event",
    name: "Minted",
    inputs: [
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "tokenURI", type: "string", indexed: false },
      { name: "productType", type: "string", indexed: false },
      { name: "edition", type: "uint256", indexed: false },
      { name: "price", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "Burned",
    inputs: [
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "burner", type: "address", indexed: true },
    ],
  },
] as const;

// USDC ABI (minimal for approve + balance)
export const USDC_ABI = [
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
] as const;
