"use client";

import { useState, useEffect, useCallback } from "react";
import { createPublicClient, http, formatUnits, parseUnits } from "viem";
import { useWallets } from "@privy-io/react-auth";
import { ARC_MERCH_NFT_ADDRESS, ARC_MERCH_NFT_ABI, USDC_ADDRESS, USDC_ABI } from "@/lib/contracts";

// Arc Testnet public client for reads
const publicClient = createPublicClient({
  chain: {
    id: 5042002,
    name: "Arc Testnet",
    nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
    rpcUrls: { default: { http: ["https://rpc.testnet.arc.network"] } },
  },
  transport: http("https://rpc.testnet.arc.network"),
});

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

  return {
    priceRaw: data,
    priceFormatted: data ? formatUnits(data, 6) : "0",
  };
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

  useEffect(() => {
    if (!owner) return;
    publicClient.readContract({
      address: USDC_ADDRESS,
      abi: USDC_ABI,
      functionName: "allowance",
      args: [owner as `0x${string}`, ARC_MERCH_NFT_ADDRESS],
    }).then(d => setData(d as bigint)).catch(() => {});
  }, [owner]);

  return { data, refetch: () => {
    if (!owner) return;
    publicClient.readContract({
      address: USDC_ADDRESS,
      abi: USDC_ABI,
      functionName: "allowance",
      args: [owner as `0x${string}`, ARC_MERCH_NFT_ADDRESS],
    }).then(d => setData(d as bigint)).catch(() => {});
  }};
}

// ── Write Hooks (use Privy wallet provider) ─────────────────

export function useMintNFT() {
  const { wallets } = useWallets();
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hash, setHash] = useState<string | undefined>();
  const [error, setError] = useState<Error | null>(null);

  const mint = useCallback(async ({
    uri, productType, designTitle, maxEditions, to,
  }: {
    uri: string; productType: string; designTitle: string; maxEditions: number; to: string;
  }) => {
    const wallet = wallets.find(w => w.walletClientType === "privy") || wallets[0];
    if (!wallet) { setError(new Error("No wallet available")); return; }

    setIsPending(true); setError(null); setIsSuccess(false);
    try {
      const provider = await wallet.getEthereumProvider();
      const { createWalletClient, custom } = await import("viem");
      const walletClient = createWalletClient({
        chain: {
          id: 5042002,
          name: "Arc Testnet",
          nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
          rpcUrls: { default: { http: ["https://rpc.testnet.arc.network"] } },
        },
        transport: custom(provider),
        account: wallet.address as `0x${string}`,
      });

      const txHash = await walletClient.writeContract({
        address: ARC_MERCH_NFT_ADDRESS,
        abi: ARC_MERCH_NFT_ABI,
        functionName: "mint",
        args: [uri, productType, designTitle, BigInt(maxEditions), to as `0x${string}`],
      });

      setHash(txHash);
      setIsPending(false);
      setIsConfirming(true);

      await publicClient.waitForTransactionReceipt({ hash: txHash });
      setIsConfirming(false);
      setIsSuccess(true);
    } catch (e: any) {
      setError(e);
      setIsPending(false);
      setIsConfirming(false);
    }
  }, [wallets]);

  return { mint, hash, isPending, isConfirming, isSuccess, error };
}

export function useApproveUSDC() {
  const { wallets } = useWallets();
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hash, setHash] = useState<string | undefined>();
  const [error, setError] = useState<Error | null>(null);

  const approve = useCallback(async (amount?: bigint) => {
    const wallet = wallets.find(w => w.walletClientType === "privy") || wallets[0];
    if (!wallet) { setError(new Error("No wallet available")); return; }

    setIsPending(true); setError(null); setIsSuccess(false);
    try {
      const provider = await wallet.getEthereumProvider();
      const { createWalletClient, custom } = await import("viem");
      const walletClient = createWalletClient({
        chain: {
          id: 5042002,
          name: "Arc Testnet",
          nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
          rpcUrls: { default: { http: ["https://rpc.testnet.arc.network"] } },
        },
        transport: custom(provider),
        account: wallet.address as `0x${string}`,
      });

      const txHash = await walletClient.writeContract({
        address: USDC_ADDRESS,
        abi: USDC_ABI,
        functionName: "approve",
        args: [ARC_MERCH_NFT_ADDRESS, amount ?? parseUnits("1000", 6)],
      });

      setHash(txHash);
      setIsPending(false);
      setIsConfirming(true);

      await publicClient.waitForTransactionReceipt({ hash: txHash });
      setIsConfirming(false);
      setIsSuccess(true);
    } catch (e: any) {
      setError(e);
      setIsPending(false);
      setIsConfirming(false);
    }
  }, [wallets]);

  return { approve, hash, isPending, isConfirming, isSuccess, error };
}

export function useBurnNFT() {
  const { wallets } = useWallets();
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hash, setHash] = useState<string | undefined>();
  const [error, setError] = useState<Error | null>(null);

  const burn = useCallback(async (tokenId: number) => {
    const wallet = wallets.find(w => w.walletClientType === "privy") || wallets[0];
    if (!wallet) { setError(new Error("No wallet available")); return; }

    setIsPending(true); setError(null); setIsSuccess(false);
    try {
      const provider = await wallet.getEthereumProvider();
      const { createWalletClient, custom } = await import("viem");
      const walletClient = createWalletClient({
        chain: {
          id: 5042002,
          name: "Arc Testnet",
          nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
          rpcUrls: { default: { http: ["https://rpc.testnet.arc.network"] } },
        },
        transport: custom(provider),
        account: wallet.address as `0x${string}`,
      });

      const txHash = await walletClient.writeContract({
        address: ARC_MERCH_NFT_ADDRESS,
        abi: ARC_MERCH_NFT_ABI,
        functionName: "burn",
        args: [BigInt(tokenId)],
      });

      setHash(txHash);
      setIsPending(false);
      setIsConfirming(true);

      await publicClient.waitForTransactionReceipt({ hash: txHash });
      setIsConfirming(false);
      setIsSuccess(true);
    } catch (e: any) {
      setError(e);
      setIsPending(false);
      setIsConfirming(false);
    }
  }, [wallets]);

  return { burn, hash, isPending, isConfirming, isSuccess, error };
}
