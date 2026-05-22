// ══════════════════════════════════════════════════════════════
// Arc Ecosystem Contracts — ERC-8004, ERC-8183, USDC
// ══════════════════════════════════════════════════════════════

// ── Contract Addresses (Arc Testnet) ─────────────────────────

// ERC-8004: AI Agent Identity, Reputation, Validation
export const IDENTITY_REGISTRY = "0x8004A818BFB912233c491871b3d84c89A494BD9e" as const;
export const REPUTATION_REGISTRY = "0x8004B663056A597Dffe9eCcC1965A193B7388713" as const;
export const VALIDATION_REGISTRY = "0x8004Cb1BF31DAf7788923b405b754f57acEB4272" as const;

// ERC-8183: Agentic Commerce / Job Settlement
export const AGENTIC_COMMERCE = "0x0747EEf0706327138c69792bF28Cd525089e4583" as const;

// Tokens
export const USDC_ADDRESS = "0x3600000000000000000000000000000000000000" as const;

// ── ABIs ─────────────────────────────────────────────────────

// ERC-8004 IdentityRegistry — register AI agents
export const IDENTITY_REGISTRY_ABI = [
  {
    type: "function",
    name: "register",
    inputs: [{ name: "metadataURI", type: "string" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
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
    name: "balanceOf",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "tokenId", type: "uint256", indexed: true },
    ],
  },
] as const;

// ERC-8004 ReputationRegistry — record feedback for agents
export const REPUTATION_REGISTRY_ABI = [
  {
    type: "function",
    name: "giveFeedback",
    inputs: [
      { name: "agentId", type: "uint256" },
      { name: "score", type: "int128" },
      { name: "category", type: "uint8" },
      { name: "tag", type: "string" },
      { name: "comment", type: "string" },
      { name: "evidence", type: "string" },
      { name: "metadata", type: "string" },
      { name: "tagHash", type: "bytes32" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getReputation",
    inputs: [{ name: "agentId", type: "uint256" }],
    outputs: [
      { name: "totalScore", type: "int256" },
      { name: "feedbackCount", type: "uint256" },
    ],
    stateMutability: "view",
  },
] as const;

// ERC-8004 ValidationRegistry — request/verify credentials
export const VALIDATION_REGISTRY_ABI = [
  {
    type: "function",
    name: "validationRequest",
    inputs: [
      { name: "validator", type: "address" },
      { name: "agentId", type: "uint256" },
      { name: "tag", type: "string" },
      { name: "tagHash", type: "bytes32" },
    ],
    outputs: [{ name: "requestId", type: "bytes32" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "validationResponse",
    inputs: [
      { name: "requestId", type: "bytes32" },
      { name: "response", type: "uint8" },
      { name: "tag", type: "string" },
      { name: "tagHash", type: "bytes32" },
      { name: "metadata", type: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getValidationStatus",
    inputs: [{ name: "requestId", type: "bytes32" }],
    outputs: [
      { name: "validator", type: "address" },
      { name: "agentId", type: "uint256" },
      { name: "response", type: "uint8" },
      { name: "responseHash", type: "bytes32" },
      { name: "tag", type: "string" },
      { name: "lastUpdate", type: "uint256" },
    ],
    stateMutability: "view",
  },
] as const;

// ERC-8183 AgenticCommerce — Job Settlement with USDC escrow
export const AGENTIC_COMMERCE_ABI = [
  {
    type: "function",
    name: "createJob",
    inputs: [
      { name: "agent", type: "address" },
      { name: "description", type: "string" },
      { name: "metadata", type: "string" },
    ],
    outputs: [{ name: "jobId", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setBudget",
    inputs: [
      { name: "jobId", type: "uint256" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "fund",
    inputs: [{ name: "jobId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "submit",
    inputs: [
      { name: "jobId", type: "uint256" },
      { name: "deliverable", type: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "complete",
    inputs: [{ name: "jobId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getJob",
    inputs: [{ name: "jobId", type: "uint256" }],
    outputs: [
      { name: "creator", type: "address" },
      { name: "agent", type: "address" },
      { name: "budget", type: "uint256" },
      { name: "status", type: "uint8" },
      { name: "description", type: "string" },
      { name: "deliverable", type: "string" },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "JobCreated",
    inputs: [
      { name: "jobId", type: "uint256", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "agent", type: "address", indexed: true },
    ],
  },
  {
    type: "event",
    name: "JobCompleted",
    inputs: [
      { name: "jobId", type: "uint256", indexed: true },
    ],
  },
] as const;

// USDC ABI (extended for marketplace payments)
export const USDC_FULL_ABI = [
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
    name: "transfer",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferFrom",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
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
