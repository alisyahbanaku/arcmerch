// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, createWalletClient, http, parseEther, formatEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";

// Nanopayments — sub-cent micro transactions for AI generation fees
// Each AI design generation costs 0.001 USDC (1/10th of a cent)
// This enables pay-per-inference model for the AI Design Agent

const ARC_TESTNET = {
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.testnet.arc.network"] } },
} as const;

const USDC_ADDRESS = "0x3600000000000000000000000000000000000000";
const USDC_ABI = [
  { type: "function", name: "transfer", inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ name: "", type: "bool" }], stateMutability: "nonpayable" },
  { type: "function", name: "balanceOf", inputs: [{ name: "account", type: "address" }], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "allowance", inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "transferFrom", inputs: [{ name: "from", type: "address" }, { name: "to", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ name: "", type: "bool" }], stateMutability: "nonpayable" },
] as const;

// Fee structure (in USDC with 6 decimals)
const GENERATION_FEE = BigInt(1000); // 0.001 USDC per generation
const TREASURY_ADDRESS = process.env.TREASURY_ADDRESS || "0xCfe0049445fDA236268d8a5B8e2a72e1E1e1e1e1";

const publicClient = createPublicClient({
  chain: ARC_TESTNET,
  transport: http("https://rpc.testnet.arc.network"),
});

export async function GET(req: NextRequest) {
  // Return nanopayment info
  return NextResponse.json({
    service: "ArcMerch AI Design Generation",
    feePerGeneration: "0.001 USDC",
    feeRaw: GENERATION_FEE.toString(),
    treasury: TREASURY_ADDRESS,
    usdcContract: USDC_ADDRESS,
    chainId: 5042002,
    description: "Sub-cent micro payment per AI design generation. Enables pay-per-inference model for the AI Design Agent (ERC-8004).",
    flow: [
      "1. User approves USDC spending to ArcMerch contract",
      "2. User requests AI generation",
      "3. Nanopayment of 0.001 USDC is deducted",
      "4. AI agent generates design",
      "5. Fee goes to treasury for agent operational costs",
    ],
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userAddress, txHash } = body;

    if (!userAddress) {
      return NextResponse.json({ error: "userAddress required" }, { status: 400 });
    }

    // Verify user has sufficient USDC balance
    const balance = await publicClient.readContract({
      address: USDC_ADDRESS,
      abi: USDC_ABI,
      functionName: "balanceOf",
      args: [userAddress as `0x${string}`],
    });

    if ((balance as bigint) < GENERATION_FEE) {
      return NextResponse.json({
        error: "Insufficient USDC balance for generation fee",
        required: "0.001 USDC",
        balance: formatEther(balance as bigint),
      }, { status: 402 });
    }

    // If txHash provided, verify the payment was made
    if (txHash) {
      try {
        const receipt = await publicClient.getTransactionReceipt({ hash: txHash as `0x${string}` });
        if (receipt.status === "success") {
          return NextResponse.json({
            status: "paid",
            txHash,
            fee: "0.001 USDC",
            message: "Nanopayment verified. AI generation authorized.",
            generationToken: `gen_${Date.now()}_${userAddress.slice(-8)}`,
          });
        }
      } catch {
        return NextResponse.json({ error: "Transaction not found or pending" }, { status: 404 });
      }
    }

    // Return payment instructions
    return NextResponse.json({
      status: "payment_required",
      fee: "0.001 USDC",
      feeRaw: GENERATION_FEE.toString(),
      treasury: TREASURY_ADDRESS,
      usdcContract: USDC_ADDRESS,
      instruction: "Transfer 0.001 USDC to treasury address, then POST back with txHash to authorize generation.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Nanopayment error" }, { status: 500 });
  }
}
