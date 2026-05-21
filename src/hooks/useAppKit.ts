"use client";

import { useState, useCallback } from "react";
import { getAppKit, createBrowserAdapter, type SupportedChain, CHAIN_DISPLAY } from "@/lib/appkit";

// ── Unified Balance Hooks ────────────────────────────────────

export function useUnifiedBalance() {
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [totalUnified, setTotalUnified] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalances = useCallback(async (account: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const kit = getAppKit();
      const result = await kit.unifiedBalance.getBalances({
        token: "USDC",
        sources: { address: account },
      });

      const chainBalances: Record<string, string> = {};
      let total = 0;

      if (result?.breakdown) {
        for (const account of result.breakdown) {
          if (account.breakdown) {
            for (const chain of account.breakdown) {
              const chainName = CHAIN_DISPLAY[chain.chain] || chain.chain;
              const existing = parseFloat(chainBalances[chainName] || "0");
              const bal = parseFloat(chain.confirmedBalance || "0");
              chainBalances[chainName] = (existing + bal).toFixed(2);
              total += bal;
            }
          }
        }
      }

      // Also use totalConfirmedBalance if available
      if (result?.totalConfirmedBalance) {
        setTotalUnified(result.totalConfirmedBalance);
      } else {
        setTotalUnified(total.toFixed(2));
      }
      setBalances(chainBalances);
    } catch (err: any) {
      setError(err.message || "Failed to fetch unified balance");
      console.error("Unified balance error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { balances, totalUnified, isLoading, error, fetchBalances };
}

// ── Unified Balance Spend ────────────────────────────────────

export function useUnifiedSpend() {
  const [isSpending, setIsSpending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const spend = useCallback(async ({
    amount,
    recipientAddress,
    sourceChains,
  }: {
    amount: string;
    recipientAddress: string;
    sourceChains?: { chain: SupportedChain; amount: string }[];
  }) => {
    setIsSpending(true);
    setError(null);
    setTxHash(null);

    try {
      const kit = getAppKit();
      const adapter = await createBrowserAdapter();

      const allocations = sourceChains || [
        { chain: "Arc_Testnet" as SupportedChain, amount },
      ];

      const result = await kit.unifiedBalance.spend({
        amount,
        from: {
          adapter,
          allocations: allocations.map((a) => ({
            chain: a.chain as any,
            amount: a.amount,
          })),
        },
        to: {
          adapter,
          chain: "Arc_Testnet" as any,
          recipientAddress,
        },
        token: "USDC",
      });

      setTxHash(result?.txHash || null);
      return result;
    } catch (err: any) {
      setError(err.message || "Spend failed");
      console.error("Unified spend error:", err);
      throw err;
    } finally {
      setIsSpending(false);
    }
  }, []);

  return { spend, isSpending, txHash, error };
}

// ── Bridge Hook ──────────────────────────────────────────────

export function useBridge() {
  const [isBridging, setIsBridging] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [estimate, setEstimate] = useState<any>(null);

  const estimateBridge = useCallback(async ({
    fromChain,
    toChain,
    amount,
  }: {
    fromChain: string;
    toChain: string;
    amount: string;
  }) => {
    try {
      const kit = getAppKit();
      const adapter = await createBrowserAdapter();

      const result = await (kit as any).estimateBridge({
        from: { adapter, chain: fromChain },
        to: { adapter, chain: toChain },
        token: "USDC",
        amount,
      });

      setEstimate(result);
      return result;
    } catch (err: any) {
      console.error("Bridge estimate error:", err);
      return null;
    }
  }, []);

  const bridge = useCallback(async ({
    fromChain,
    toChain,
    amount,
    recipientAddress,
  }: {
    fromChain: string;
    toChain: string;
    amount: string;
    recipientAddress: string;
  }) => {
    setIsBridging(true);
    setError(null);
    setTxHash(null);

    try {
      const kit = getAppKit();
      const adapter = await createBrowserAdapter();

      const result = await (kit as any).bridge({
        from: { adapter, chain: fromChain },
        to: { adapter, chain: toChain, recipientAddress },
        token: "USDC",
        amount,
      });

      setTxHash(result?.txHash || null);
      return result;
    } catch (err: any) {
      setError(err.message || "Bridge failed");
      console.error("Bridge error:", err);
      throw err;
    } finally {
      setIsBridging(false);
    }
  }, []);

  return { bridge, estimateBridge, estimate, isBridging, txHash, error };
}

// ── Send Hook ────────────────────────────────────────────────

export function useSend() {
  const [isSending, setIsSending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(async ({
    chain,
    amount,
    recipientAddress,
  }: {
    chain: string;
    amount: string;
    recipientAddress: string;
  }) => {
    setIsSending(true);
    setError(null);
    setTxHash(null);

    try {
      const kit = getAppKit();
      const adapter = await createBrowserAdapter();

      const result = await (kit as any).send({
        from: { adapter, chain },
        to: { recipientAddress },
        token: "USDC",
        amount,
      });

      setTxHash(result?.txHash || null);
      return result;
    } catch (err: any) {
      setError(err.message || "Send failed");
      console.error("Send error:", err);
      throw err;
    } finally {
      setIsSending(false);
    }
  }, []);

  return { send, isSending, txHash, error };
}
