// ArcMerch AI Design Agent — ERC-8004 metadata
// This gets uploaded to IPFS and registered on-chain

export const ARCMERCH_AGENT_METADATA = {
  name: "ArcMerch AI Design Generator",
  description: "AI-powered merchandise design agent on Arc blockchain. Generates unique artwork for t-shirts, hoodies, caps, posters, and stickers. Each design is minted as an ERC-721 NFT with burn-to-redeem mechanic for physical product fulfillment.",
  image: "https://arcmerch.vercel.app/logo.jpg",
  agent_type: "creative",
  capabilities: [
    "text-to-image generation",
    "merchandise design",
    "NFT metadata creation",
    "product mockup generation",
    "style transfer",
  ],
  version: "1.0.0",
  external_url: "https://arcmerch.vercel.app",
  properties: {
    chain: "Arc Testnet",
    chain_id: 5042002,
    contract: "0x27881c74CF4Db0B361Bc67647046583C6e0f2162",
    supported_products: ["T-Shirt", "Hoodie", "Cap", "Sticker", "Poster"],
    payment_token: "USDC",
    creator: "@arconomist",
  },
};

// Job metadata template for ERC-8183 print fulfillment
export function createPrintJobMetadata(params: {
  tokenId: number;
  productType: string;
  designTitle: string;
  size?: string;
  color?: string;
  shippingAddress?: string;
}) {
  return JSON.stringify({
    type: "print_fulfillment",
    version: "1.0.0",
    platform: "ArcMerch",
    order: {
      tokenId: params.tokenId,
      productType: params.productType,
      designTitle: params.designTitle,
      size: params.size || "M",
      color: params.color || "Black",
    },
    shipping: params.shippingAddress ? {
      address: params.shippingAddress,
    } : undefined,
    requirements: {
      quality: "premium",
      turnaround_days: 7,
      tracking_required: true,
    },
  });
}

// Reputation tags for the ecosystem
export const REPUTATION_TAGS = {
  SUCCESSFUL_MINT: "successful_mint",
  QUALITY_DESIGN: "quality_design",
  FAST_FULFILLMENT: "fast_fulfillment",
  VERIFIED_DELIVERY: "verified_delivery",
  COMMUNITY_FAVORITE: "community_favorite",
} as const;
