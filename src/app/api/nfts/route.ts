// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http, parseAbiItem } from "viem";
import { ARC_MERCH_NFT_ADDRESS, ARC_MERCH_NFT_ABI } from "../../../lib/contracts";

const arcTestnet = {
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.testnet.arc.network"] } },
} as const;

const publicClient = createPublicClient({
  chain: arcTestnet,
  transport: http("https://rpc.testnet.arc.network"),
});

export async function GET(req: NextRequest) {
  try {
    // Get total minted count
    const totalMinted = await publicClient.readContract({
      address: ARC_MERCH_NFT_ADDRESS,
      abi: ARC_MERCH_NFT_ABI,
      functionName: "totalMinted",
    }) as bigint;

    const total = Number(totalMinted);
    if (total === 0) {
      return NextResponse.json({ nfts: [], total: 0 });
    }

    // Fetch all minted NFTs (up to 50 most recent)
    const limit = Math.min(total, 50);
    const startId = Math.max(1, total - limit + 1);

    const nfts = [];
    for (let tokenId = total; tokenId >= startId; tokenId--) {
      try {
        const [uri, editionInfo, owner] = await Promise.all([
          publicClient.readContract({
            address: ARC_MERCH_NFT_ADDRESS,
            abi: ARC_MERCH_NFT_ABI,
            functionName: "tokenURI",
            args: [BigInt(tokenId)],
          }),
          publicClient.readContract({
            address: ARC_MERCH_NFT_ADDRESS,
            abi: ARC_MERCH_NFT_ABI,
            functionName: "getEditionInfo",
            args: [BigInt(tokenId)],
          }),
          publicClient.readContract({
            address: ARC_MERCH_NFT_ADDRESS,
            abi: ARC_MERCH_NFT_ABI,
            functionName: "ownerOf",
            args: [BigInt(tokenId)],
          }),
        ]);

        const [maxEditions, mintedEditions, productType, designTitle, creator] = editionInfo as [bigint, bigint, string, string, string];

        // Try to fetch metadata from URI
        let metadata: any = {};
        const uriStr = uri as string;
        if (uriStr.startsWith("data:application/json;base64,")) {
          const base64 = uriStr.replace("data:application/json;base64,", "");
          metadata = JSON.parse(Buffer.from(base64, "base64").toString());
        } else if (uriStr.startsWith("ipfs://")) {
          try {
            const gateway = uriStr.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
            const metaRes = await fetch(gateway, { signal: AbortSignal.timeout(5000) });
            if (metaRes.ok) metadata = await metaRes.json();
          } catch {}
        } else if (uriStr.startsWith("http")) {
          try {
            const metaRes = await fetch(uriStr, { signal: AbortSignal.timeout(5000) });
            if (metaRes.ok) metadata = await metaRes.json();
          } catch {}
        }

        nfts.push({
          tokenId,
          owner: owner as string,
          creator,
          uri: uriStr,
          productType,
          designTitle,
          maxEditions: Number(maxEditions),
          mintedEditions: Number(mintedEditions),
          image: metadata.image || null,
          name: metadata.name || designTitle,
          description: metadata.description || "",
          attributes: metadata.attributes || [],
        });
      } catch {
        // Token might be burned, skip
        continue;
      }
    }

    return NextResponse.json({ nfts, total });
  } catch (err: any) {
    console.error("NFT fetch error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch NFTs" },
      { status: 500 }
    );
  }
}
