"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useBalance } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { ARC_MERCH_NFT_ADDRESS, ARC_MERCH_NFT_ABI, USDC_ADDRESS, USDC_ABI } from "@/lib/contracts";

// ── Read Hooks ──────────────────────────────────────────────

export function useMintPrice() {
  const { data, ...rest } = useReadContract({
    address: ARC_MERCH_NFT_ADDRESS,
    abi: ARC_MERCH_NFT_ABI,
    functionName: "mintPrice",
  });

  return {
    priceRaw: data,
    priceFormatted: data ? formatUnits(data, 6) : "0",
    ...rest,
  };
}

export function useTotalMinted() {
  return useReadContract({
    address: ARC_MERCH_NFT_ADDRESS,
    abi: ARC_MERCH_NFT_ABI,
    functionName: "totalMinted",
  });
}

export function useMaxSupply() {
  return useReadContract({
    address: ARC_MERCH_NFT_ADDRESS,
    abi: ARC_MERCH_NFT_ABI,
    functionName: "maxSupply",
  });
}

export function useNFTBalance(address?: `0x${string}`) {
  return useReadContract({
    address: ARC_MERCH_NFT_ADDRESS,
    abi: ARC_MERCH_NFT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}

export function useTokenOwner(tokenId: bigint) {
  return useReadContract({
    address: ARC_MERCH_NFT_ADDRESS,
    abi: ARC_MERCH_NFT_ABI,
    functionName: "ownerOf",
    args: [tokenId],
  });
}

export function useTokenURI(tokenId: bigint) {
  return useReadContract({
    address: ARC_MERCH_NFT_ADDRESS,
    abi: ARC_MERCH_NFT_ABI,
    functionName: "tokenURI",
    args: [tokenId],
  });
}

export function useEditionInfo(tokenId: bigint) {
  return useReadContract({
    address: ARC_MERCH_NFT_ADDRESS,
    abi: ARC_MERCH_NFT_ABI,
    functionName: "getEditionInfo",
    args: [tokenId],
  });
}

export function useUSDCBalance(address?: `0x${string}`) {
  return useReadContract({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}

export function useUSDCAllowance(owner?: `0x${string}`) {
  return useReadContract({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: "allowance",
    args: owner ? [owner, ARC_MERCH_NFT_ADDRESS] : undefined,
    query: { enabled: !!owner },
  });
}

// ── Write Hooks ─────────────────────────────────────────────

export function useMintNFT() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const mint = ({
    uri,
    productType,
    designTitle,
    maxEditions,
    to,
  }: {
    uri: string;
    productType: string;
    designTitle: string;
    maxEditions: number;
    to: `0x${string}`;
  }) => {
    writeContract({
      address: ARC_MERCH_NFT_ADDRESS,
      abi: ARC_MERCH_NFT_ABI,
      functionName: "mint",
      args: [uri, productType, designTitle, BigInt(maxEditions), to],
    });
  };

  return { mint, hash, isPending, isConfirming, isSuccess, error };
}

export function useMintEdition() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const mintEdition = ({
    originalTokenId,
    uri,
    to,
  }: {
    originalTokenId: number;
    uri: string;
    to: `0x${string}`;
  }) => {
    writeContract({
      address: ARC_MERCH_NFT_ADDRESS,
      abi: ARC_MERCH_NFT_ABI,
      functionName: "mintEdition",
      args: [BigInt(originalTokenId), uri, to],
    });
  };

  return { mintEdition, hash, isPending, isConfirming, isSuccess, error };
}

export function useBurnNFT() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const burn = (tokenId: number) => {
    writeContract({
      address: ARC_MERCH_NFT_ADDRESS,
      abi: ARC_MERCH_NFT_ABI,
      functionName: "burn",
      args: [BigInt(tokenId)],
    });
  };

  return { burn, hash, isPending, isConfirming, isSuccess, error };
}

export function useApproveUSDC() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approve = (amount?: bigint) => {
    writeContract({
      address: USDC_ADDRESS,
      abi: USDC_ABI,
      functionName: "approve",
      args: [ARC_MERCH_NFT_ADDRESS, amount ?? parseUnits("1000", 6)], // Default: approve 1000 USDC
    });
  };

  return { approve, hash, isPending, isConfirming, isSuccess, error };
}

// ── Combined Hook ───────────────────────────────────────────

export function useArcMerch() {
  const { address, isConnected } = useAccount();
  const { priceRaw, priceFormatted } = useMintPrice();
  const totalMinted = useTotalMinted();
  const maxSupply = useMaxSupply();
  const nftBalance = useNFTBalance(address);
  const usdcBalance = useUSDCBalance(address);
  const usdcAllowance = useUSDCAllowance(address);

  return {
    address,
    isConnected,
    mintPrice: priceRaw,
    mintPriceFormatted: priceFormatted,
    totalMinted: totalMinted.data,
    maxSupply: maxSupply.data,
    nftBalance: nftBalance.data,
    usdcBalance: usdcBalance.data,
    usdcBalanceFormatted: usdcBalance.data ? formatUnits(usdcBalance.data, 6) : "0",
    usdcAllowance: usdcAllowance.data,
  };
}
