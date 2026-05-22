"use client";

import { useState, useCallback } from "react";
import { createPublicClient, http, createWalletClient, custom, keccak256, toBytes } from "viem";
import { useWallets } from "@privy-io/react-auth";
import { useActiveWallet } from "@/lib/wallet-context";
import {
  IDENTITY_REGISTRY,
  REPUTATION_REGISTRY,
  AGENTIC_COMMERCE,
  USDC_ADDRESS,
  IDENTITY_REGISTRY_ABI,
  REPUTATION_REGISTRY_ABI,
  AGENTIC_COMMERCE_ABI,
  USDC_FULL_ABI,
} from "@/lib/arc-ecosystem";

// Arc Testnet chain config
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

async function getWalletClient(wallets: any[], activeAddress: string) {
  const wallet = wallets.find((w: any) => w.address === activeAddress) || wallets[0];
  if (!wallet) throw new Error("No wallet available. Please sign in first.");
  const provider = await wallet.getEthereumProvider();
  return createWalletClient({
    chain: arcTestnet,
    transport: custom(provider),
    account: wallet.address as `0x${string}`,
  });
}

// ══════════════════════════════════════════════════════════════
// ERC-8004: AI Agent Identity
// ══════════════════════════════════════════════════════════════

/**
 * Register the ArcMerch AI Design Generator as an on-chain agent
 * Returns the agent's token ID (identity NFT)
 */
export function useRegisterAgent() {
  const { wallets } = useWallets();
  const { activeWallet } = useActiveWallet();
  const [isPending, setIsPending] = useState(false);
  const [hash, setHash] = useState<string | null>(null);
  const [agentId, setAgentId] = useState<bigint | null>(null);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(async (metadataURI: string) => {
    if (!activeWallet?.address) throw new Error("No wallet connected");
    setIsPending(true);
    setError(null);
    try {
      const client = await getWalletClient(wallets, activeWallet.address);
      const txHash = await client.writeContract({
        address: IDENTITY_REGISTRY,
        abi: IDENTITY_REGISTRY_ABI,
        functionName: "register",
        args: [metadataURI],
      });
      setHash(txHash);

      // Wait for receipt and extract agentId from Transfer event
      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
      const transferLog = receipt.logs.find(
        (log) => log.address.toLowerCase() === IDENTITY_REGISTRY.toLowerCase() && log.topics.length === 4
      );
      if (transferLog && transferLog.topics[3]) {
        setAgentId(BigInt(transferLog.topics[3]));
      }
      return txHash;
    } catch (e: any) {
      setError(e.message || "Registration failed");
      throw e;
    } finally {
      setIsPending(false);
    }
  }, [wallets, activeWallet]);

  return { register, isPending, hash, agentId, error };
}

/**
 * Read agent identity info
 */
export function useAgentIdentity(agentId?: bigint) {
  const [data, setData] = useState<{ owner: string; metadataURI: string } | null>(null);

  const fetch = useCallback(async () => {
    if (!agentId) return;
    try {
      const [owner, uri] = await Promise.all([
        publicClient.readContract({
          address: IDENTITY_REGISTRY,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: "ownerOf",
          args: [agentId],
        }),
        publicClient.readContract({
          address: IDENTITY_REGISTRY,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: "tokenURI",
          args: [agentId],
        }),
      ]);
      setData({ owner: owner as string, metadataURI: uri as string });
    } catch {}
  }, [agentId]);

  return { data, fetch };
}

// ══════════════════════════════════════════════════════════════
// ERC-8004: Reputation System
// ══════════════════════════════════════════════════════════════

/**
 * Give reputation feedback to a creator/agent
 */
export function useGiveReputation() {
  const { wallets } = useWallets();
  const { activeWallet } = useActiveWallet();
  const [isPending, setIsPending] = useState(false);
  const [hash, setHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const giveFeedback = useCallback(async (
    agentId: bigint,
    score: number,
    tag: string,
    comment: string = ""
  ) => {
    if (!activeWallet?.address) throw new Error("No wallet connected");
    setIsPending(true);
    setError(null);
    try {
      const client = await getWalletClient(wallets, activeWallet.address);
      const tagHash = keccak256(toBytes(tag));
      const txHash = await client.writeContract({
        address: REPUTATION_REGISTRY,
        abi: REPUTATION_REGISTRY_ABI,
        functionName: "giveFeedback",
        args: [agentId, BigInt(score), 0, tag, comment, "", "", tagHash],
      });
      setHash(txHash);
      await publicClient.waitForTransactionReceipt({ hash: txHash });
      return txHash;
    } catch (e: any) {
      setError(e.message || "Feedback failed");
      throw e;
    } finally {
      setIsPending(false);
    }
  }, [wallets, activeWallet]);

  return { giveFeedback, isPending, hash, error };
}

/**
 * Read reputation score for an agent
 */
export function useAgentReputation(agentId?: bigint) {
  const [data, setData] = useState<{ totalScore: bigint; feedbackCount: bigint } | null>(null);

  const fetch = useCallback(async () => {
    if (!agentId) return;
    try {
      const result = await publicClient.readContract({
        address: REPUTATION_REGISTRY,
        abi: REPUTATION_REGISTRY_ABI,
        functionName: "getReputation",
        args: [agentId],
      });
      const [totalScore, feedbackCount] = result as [bigint, bigint];
      setData({ totalScore, feedbackCount });
    } catch {}
  }, [agentId]);

  return { data, fetch };
}

// ══════════════════════════════════════════════════════════════
// ERC-8183: Job Settlement (Print Fulfillment)
// ══════════════════════════════════════════════════════════════

export type JobStatus = "created" | "funded" | "submitted" | "completed" | "cancelled";
const JOB_STATUS_MAP: Record<number, JobStatus> = {
  0: "created",
  1: "funded",
  2: "submitted",
  3: "completed",
  4: "cancelled",
};

/**
 * Create a print fulfillment job (burn NFT → create job → escrow USDC)
 */
export function useCreateJob() {
  const { wallets } = useWallets();
  const { activeWallet } = useActiveWallet();
  const [isPending, setIsPending] = useState(false);
  const [hash, setHash] = useState<string | null>(null);
  const [jobId, setJobId] = useState<bigint | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createJob = useCallback(async (
    agentAddress: string,
    description: string,
    metadata: string,
    budgetUSDC: number
  ) => {
    if (!activeWallet?.address) throw new Error("No wallet connected");
    setIsPending(true);
    setError(null);
    try {
      const client = await getWalletClient(wallets, activeWallet.address);
      const budgetRaw = BigInt(Math.round(budgetUSDC * 1e6)); // 6 decimals

      // Step 1: Approve USDC for escrow
      const allowance = await publicClient.readContract({
        address: USDC_ADDRESS,
        abi: USDC_FULL_ABI,
        functionName: "allowance",
        args: [activeWallet.address as `0x${string}`, AGENTIC_COMMERCE],
      }) as bigint;

      if (allowance < budgetRaw) {
        const approveTx = await client.writeContract({
          address: USDC_ADDRESS,
          abi: USDC_FULL_ABI,
          functionName: "approve",
          args: [AGENTIC_COMMERCE, budgetRaw],
        });
        await publicClient.waitForTransactionReceipt({ hash: approveTx });
      }

      // Step 2: Create job
      const createTx = await client.writeContract({
        address: AGENTIC_COMMERCE,
        abi: AGENTIC_COMMERCE_ABI,
        functionName: "createJob",
        args: [agentAddress as `0x${string}`, description, metadata],
      });
      const receipt = await publicClient.waitForTransactionReceipt({ hash: createTx });

      // Extract jobId from JobCreated event
      const jobLog = receipt.logs.find(
        (log) => log.address.toLowerCase() === AGENTIC_COMMERCE.toLowerCase()
      );
      if (jobLog && jobLog.topics[1]) {
        const id = BigInt(jobLog.topics[1]);
        setJobId(id);

        // Step 3: Set budget
        const budgetTx = await client.writeContract({
          address: AGENTIC_COMMERCE,
          abi: AGENTIC_COMMERCE_ABI,
          functionName: "setBudget",
          args: [id, budgetRaw],
        });
        await publicClient.waitForTransactionReceipt({ hash: budgetTx });

        // Step 4: Fund (escrow USDC)
        const fundTx = await client.writeContract({
          address: AGENTIC_COMMERCE,
          abi: AGENTIC_COMMERCE_ABI,
          functionName: "fund",
          args: [id],
        });
        setHash(fundTx);
        await publicClient.waitForTransactionReceipt({ hash: fundTx });
      }

      return createTx;
    } catch (e: any) {
      setError(e.message || "Job creation failed");
      throw e;
    } finally {
      setIsPending(false);
    }
  }, [wallets, activeWallet]);

  return { createJob, isPending, hash, jobId, error };
}

/**
 * Submit deliverable for a job (printer/fulfiller)
 */
export function useSubmitJob() {
  const { wallets } = useWallets();
  const { activeWallet } = useActiveWallet();
  const [isPending, setIsPending] = useState(false);
  const [hash, setHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (jobId: bigint, deliverable: string) => {
    if (!activeWallet?.address) throw new Error("No wallet connected");
    setIsPending(true);
    setError(null);
    try {
      const client = await getWalletClient(wallets, activeWallet.address);
      const txHash = await client.writeContract({
        address: AGENTIC_COMMERCE,
        abi: AGENTIC_COMMERCE_ABI,
        functionName: "submit",
        args: [jobId, deliverable],
      });
      setHash(txHash);
      await publicClient.waitForTransactionReceipt({ hash: txHash });
      return txHash;
    } catch (e: any) {
      setError(e.message || "Submit failed");
      throw e;
    } finally {
      setIsPending(false);
    }
  }, [wallets, activeWallet]);

  return { submit, isPending, hash, error };
}

/**
 * Complete a job (release escrow to agent/printer)
 */
export function useCompleteJob() {
  const { wallets } = useWallets();
  const { activeWallet } = useActiveWallet();
  const [isPending, setIsPending] = useState(false);
  const [hash, setHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const complete = useCallback(async (jobId: bigint) => {
    if (!activeWallet?.address) throw new Error("No wallet connected");
    setIsPending(true);
    setError(null);
    try {
      const client = await getWalletClient(wallets, activeWallet.address);
      const txHash = await client.writeContract({
        address: AGENTIC_COMMERCE,
        abi: AGENTIC_COMMERCE_ABI,
        functionName: "complete",
        args: [jobId],
      });
      setHash(txHash);
      await publicClient.waitForTransactionReceipt({ hash: txHash });
      return txHash;
    } catch (e: any) {
      setError(e.message || "Complete failed");
      throw e;
    } finally {
      setIsPending(false);
    }
  }, [wallets, activeWallet]);

  return { complete, isPending, hash, error };
}

/**
 * Read job status
 */
export function useJobStatus(jobId?: bigint) {
  const [data, setData] = useState<{
    creator: string;
    agent: string;
    budget: bigint;
    status: JobStatus;
    description: string;
    deliverable: string;
  } | null>(null);

  const fetch = useCallback(async () => {
    if (!jobId) return;
    try {
      const result = await publicClient.readContract({
        address: AGENTIC_COMMERCE,
        abi: AGENTIC_COMMERCE_ABI,
        functionName: "getJob",
        args: [jobId],
      });
      const [creator, agent, budget, status, description, deliverable] = result as [string, string, bigint, number, string, string];
      setData({
        creator,
        agent,
        budget,
        status: JOB_STATUS_MAP[status] || "created",
        description,
        deliverable,
      });
    } catch {}
  }, [jobId]);

  return { data, fetch };
}

// ══════════════════════════════════════════════════════════════
// USDC Payment Helpers
// ══════════════════════════════════════════════════════════════

/**
 * Approve USDC spending for a contract
 */
export function useApproveUSDC() {
  const { wallets } = useWallets();
  const { activeWallet } = useActiveWallet();
  const [isPending, setIsPending] = useState(false);
  const [hash, setHash] = useState<string | null>(null);

  const approve = useCallback(async (spender: string, amount: bigint) => {
    if (!activeWallet?.address) throw new Error("No wallet connected");
    setIsPending(true);
    try {
      const client = await getWalletClient(wallets, activeWallet.address);
      const txHash = await client.writeContract({
        address: USDC_ADDRESS,
        abi: USDC_FULL_ABI,
        functionName: "approve",
        args: [spender as `0x${string}`, amount],
      });
      setHash(txHash);
      await publicClient.waitForTransactionReceipt({ hash: txHash });
      return txHash;
    } finally {
      setIsPending(false);
    }
  }, [wallets, activeWallet]);

  return { approve, isPending, hash };
}

/**
 * Direct USDC transfer (for marketplace purchases without contract)
 */
export function useTransferUSDC() {
  const { wallets } = useWallets();
  const { activeWallet } = useActiveWallet();
  const [isPending, setIsPending] = useState(false);
  const [hash, setHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const transfer = useCallback(async (to: string, amountUSDC: number) => {
    if (!activeWallet?.address) throw new Error("No wallet connected");
    setIsPending(true);
    setError(null);
    try {
      const client = await getWalletClient(wallets, activeWallet.address);
      const amount = BigInt(Math.round(amountUSDC * 1e6)); // 6 decimals
      const txHash = await client.writeContract({
        address: USDC_ADDRESS,
        abi: USDC_FULL_ABI,
        functionName: "transfer",
        args: [to as `0x${string}`, amount],
      });
      setHash(txHash);
      await publicClient.waitForTransactionReceipt({ hash: txHash });
      return txHash;
    } catch (e: any) {
      setError(e.message || "Transfer failed");
      throw e;
    } finally {
      setIsPending(false);
    }
  }, [wallets, activeWallet]);

  return { transfer, isPending, hash, error };
}
