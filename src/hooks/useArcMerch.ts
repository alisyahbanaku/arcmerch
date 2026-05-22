"use client";

import { useState, useEffect, useCallback } from "react";
import { createPublicClient, http, formatUnits, parseUnits, createWalletClient, custom } from "viem";
import { useWallets } from "@privy-io/react-auth";
import { useActiveWallet } from "@/lib/wallet-context";
import { ARC_MERCH_NFT_ADDRESS, ARC_MERCH_NFT_ABI, USDC_ADDRESS, USDC_ABI } from "@/lib/contracts";

// Arc Testnet chain config
const arcTestnet = {
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.testnet.arc.network"] } },
} as const;

// Public client for reads
const publicClient = createPublicClient({
  chain: arcTestnet,
  transport: http("https://rpc.testnet.arc.network"),
});

// Helper: get wallet client from active wallet
async function getWalletClient(wallets: any[], activeAddress: string) {
  const wallet = wallets.find(w => w.address === activeAddress) || wallets[0];
  if (!wallet) throw new Error("No wallet available. Please sign in first.");
  const provider = await wallet.getEthereumProvider();
  return createWalletClient({
    chain: arcTestnet,
    transport: custom(provider),
    account: wallet.address as `0x${string}`,
  });
}

// ── Read Hooks ──────────────────────────────────────────────

export function useMintPrice() {
  const [data, setData] = useState<bigint | undefined>();

  useEffect(() => {
    publicClient.readContract({
      address: ARC_MERCH_NFT_ADDRESS,
      abi: ARC_MERCH_NFT_ABI,
      functionName: "mintPrice",
    }).then(d => setData(d as bigint)).catch(() => {});
  }, []);

  return { priceRaw: data, priceFormatted: data ? formatUnits(data, 6) : "0" };
}

export function useTotalMinted() {
  const [data, setData] = useState<bigint | undefined>();
  useEffect(() => {
    publicClient.readContract({
      address: ARC_MERCH_NFT_ADDRESS,
      abi: ARC_MERCH_NFT_ABI,
      functionName: "totalMinted",
    }).then(d => setData(d as bigint)).catch(() => {});
  }, []);
  return { data };
}

export function useMaxSupply() {
  const [data, setData] = useState<bigint | undefined>();
  useEffect(() => {
    publicClient.readContract({
      address: ARC_MERCH_NFT_ADDRESS,
      abi: ARC_MERCH_NFT_ABI,
      functionName: "maxSupply",
    }).then(d => setData(d as bigint)).catch(() => {});
  }, []);
  return { data };
}

export function useUSDCBalance(address?: string) {
  const [data, setData] = useState<bigint | undefined>();
  useEffect(() => {
    if (!address) return;
    publicClient.readContract({
      address: USDC_ADDRESS,
      abi: USDC_ABI,
      functionName: "balanceOf",
      args: [address as `0x${string}`],
    }).then(d => setData(d as bigint)).catch(() => {});
  }, [address]);
  return { data };
}

export function useUSDCAllowance(owner?: string) {
  const [data, setData] = useState<bigint | undefined>();
  const refetch = useCallback(() => {
    if (!owner) return;
    publicClient.readContract({
      address: USDC_ADDRESS,
      abi: USDC_ABI,
      functionName: "allowance",
      args: [owner as `0x${string}`, ARC_MERCH_NFT_ADDRESS],
    }).then(d => setData(d as bigint)).catch(() => {});
  }, [owner]);

  useEffect(() => { refetch(); }, [refetch]);
  return { data, refetch };
}

// ── Write Hooks ─────────────────────────────────────────────

export function useMintNFT() {
  const { wallets } = useWallets();
  const { activeWallet } = useActiveWallet();
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hash, setHash] = useState<string | undefined>();
  const [error, setError] = useState<Error | null>(null);

  const mint = useCallback(async ({ uri, productType, designTitle, maxEditions, to }: {
    uri: string; productType: string; designTitle: string; maxEditions: number; to: string;
  }) => {
    setIsPending(true); setError(null); setIsSuccess(false);
    try {
      const wc = await getWalletClient(wallets, activeWallet?.address || "");
      const txHash = await wc.writeContract({
        address: ARC_MERCH_NFT_ADDRESS,
        abi: ARC_MERCH_NFT_ABI,
        functionName: "mint",
        args: [uri, productType, designTitle, BigInt(maxEditions), to as `0x${string}`],
      });
      setHash(txHash); setIsPending(false); setIsConfirming(true);
      await publicClient.waitForTransactionReceipt({ hash: txHash });
      setIsConfirming(false); setIsSuccess(true);
    } catch (e: any) {
      setError(e); setIsPending(false); setIsConfirming(false);
    }
  }, [wallets, activeWallet]);

  return { mint, hash, isPending, isConfirming, isSuccess, error };
}

export function useApproveUSDC() {
  const { wallets } = useWallets();
  const { activeWallet } = useActiveWallet();
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hash, setHash] = useState<string | undefined>();
  const [error, setError] = useState<Error | null>(null);

  const approve = useCallback(async (amount?: bigint) => {
    setIsPending(true); setError(null); setIsSuccess(false);
    try {
      const wc = await getWalletClient(wallets, activeWallet?.address || "");
      const txHash = await wc.writeContract({
        address: USDC_ADDRESS,
        abi: USDC_ABI,
        functionName: "approve",
        args: [ARC_MERCH_NFT_ADDRESS, amount ?? parseUnits("1000", 6)],
      });
      setHash(txHash); setIsPending(false); setIsConfirming(true);
      await publicClient.waitForTransactionReceipt({ hash: txHash });
      setIsConfirming(false); setIsSuccess(true);
    } catch (e: any) {
      setError(e); setIsPending(false); setIsConfirming(false);
    }
  }, [wallets, activeWallet]);

  return { approve, hash, isPending, isConfirming, isSuccess, error };
}

export function useBurnNFT() {
  const { wallets } = useWallets();
  const { activeWallet } = useActiveWallet();
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hash, setHash] = useState<string | undefined>();
  const [error, setError] = useState<Error | null>(null);

  const burn = useCallback(async (tokenId: number) => {
    setIsPending(true); setError(null); setIsSuccess(false);
    try {
      const wc = await getWalletClient(wallets, activeWallet?.address || "");
      const txHash = await wc.writeContract({
        address: ARC_MERCH_NFT_ADDRESS,
        abi: ARC_MERCH_NFT_ABI,
        functionName: "burn",
        args: [BigInt(tokenId)],
      });
      setHash(txHash); setIsPending(false); setIsConfirming(true);
      await publicClient.waitForTransactionReceipt({ hash: txHash });
      setIsConfirming(false); setIsSuccess(true);
    } catch (e: any) {
      setError(e); setIsPending(false); setIsConfirming(false);
    }
  }, [wallets, activeWallet]);

  return { burn, hash, isPending, isConfirming, isSuccess, error };
}
