"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Loader2, Check, ExternalLink, Globe, Zap, Shield, RefreshCw } from "lucide-react";
import { useAccount, useConnect } from "wagmi";
import { useUnifiedBalance, useBridge } from "@/hooks/useAppKit";
import { CHAIN_DISPLAY, CHAIN_ICONS, SUPPORTED_CHAINS } from "@/lib/appkit";

const BRIDGE_CHAINS = [
  { id: "Ethereum_Sepolia", name: "Ethereum", icon: "⟠", color: "#627EEA" },
  { id: "Base_Sepolia", name: "Base", icon: "🔷", color: "#0052FF" },
  { id: "Arbitrum_Sepolia", name: "Arbitrum", icon: "🔵", color: "#28A0F0" },
  { id: "Optimism_Sepolia", name: "Optimism", icon: "🔴", color: "#FF0420" },
  { id: "Polygon_Amoy_Testnet", name: "Polygon", icon: "🟣", color: "#8247E5" },
  { id: "Avalanche_Fuji", name: "Avalanche", icon: "🔺", color: "#E84142" },
];

export default function BridgePage() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { balances, totalUnified, isLoading: balancesLoading, fetchBalances } = useUnifiedBalance();
  const { bridge, estimateBridge, estimate, isBridging, txHash, error: bridgeError } = useBridge();

  const [fromChain, setFromChain] = useState("Base_Sepolia");
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"select" | "confirm" | "processing" | "success">("select");

  useEffect(() => {
    if (address) fetchBalances(address);
  }, [address, fetchBalances]);

  const handleEstimate = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    await estimateBridge({
      fromChain,
      toChain: "Arc_Testnet",
      amount,
    });
    setStep("confirm");
  };

  const handleBridge = async () => {
    if (!address || !amount) return;
    setStep("processing");
    try {
      await bridge({
        fromChain,
        toChain: "Arc_Testnet",
        amount,
        recipientAddress: address,
      });
      setStep("success");
      if (address) fetchBalances(address);
    } catch {
      setStep("confirm");
    }
  };

  const selectedChain = BRIDGE_CHAINS.find((c) => c.id === fromChain);

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="mx-auto max-w-[720px] px-6 lg:px-10 py-16">
        {/* Header */}
        <div className="section-label mb-3">{"{ BRIDGE }"}</div>
        <h1 className="text-[40px] md:text-[56px] font-light tracking-[-0.02em] text-white mb-3">
          Bridge USDC
        </h1>
        <p className="text-[16px] text-white/40 mb-12">
          Transfer USDC from any chain to Arc. Powered by Circle Gateway.
        </p>

        {/* Wallet Connect */}
        {!isConnected && (
          <div className="rounded-xl border border-[#E9A13F]/20 bg-[#E9A13F]/5 p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Globe className="w-5 h-5 text-[#E9A13F]" />
              <span className="text-[15px] font-medium text-white">Connect wallet to bridge</span>
            </div>
            <p className="text-[13px] text-white/40 mb-4">
              Connect your wallet to view balances and bridge USDC to Arc Testnet.
            </p>
            <button
              onClick={() => {
                const injected = connectors.find((c) => c.id === "injected");
                if (injected) connect({ connector: injected });
              }}
              className="arc-btn text-sm px-6 py-2.5"
            >
              Connect Wallet
            </button>
          </div>
        )}

        {/* Unified Balance Overview */}
        {isConnected && (
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#E9A13F]" />
                <span className="text-[14px] font-medium text-white">Unified Balance</span>
              </div>
              <button
                onClick={() => address && fetchBalances(address)}
                disabled={balancesLoading}
                className="text-[12px] text-white/30 hover:text-white/60 flex items-center gap-1 transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${balancesLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>

            <div className="text-[32px] font-light text-white mb-1">
              {totalUnified} <span className="text-[16px] text-white/40">USDC</span>
            </div>
            <p className="text-[12px] text-white/30 mb-4">
              Across all chains • Powered by Circle Gateway
            </p>

            {/* Chain breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {BRIDGE_CHAINS.map((chain) => {
                const bal = balances[chain.name] || "0";
                return (
                  <div
                    key={chain.id}
                    className="rounded-lg border border-white/5 bg-white/[0.02] p-3"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[14px]">{chain.icon}</span>
                      <span className="text-[12px] text-white/60">{chain.name}</span>
                    </div>
                    <div className="text-[14px] mono text-white">{bal} USDC</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bridge Widget */}
        {isConnected && (
          <div className="rounded-xl border border-white/10 p-6">
            {step === "select" && (
              <div className="space-y-6">
                <h3 className="text-[18px] font-light text-white">Select source chain</h3>

                {/* Chain selector */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {BRIDGE_CHAINS.map((chain) => (
                    <button
                      key={chain.id}
                      onClick={() => setFromChain(chain.id)}
                      className={`rounded-lg border p-4 text-left transition-all duration-150 ${
                        fromChain === chain.id
                          ? "border-[#E9A13F] bg-[#E9A13F]/5"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[20px]">{chain.icon}</span>
                        <span className="text-[14px] font-medium text-white">{chain.name}</span>
                      </div>
                      <div className="text-[12px] text-white/30">
                        {balances[chain.name] || "0"} USDC
                      </div>
                    </button>
                  ))}
                </div>

                {/* Amount */}
                <div>
                  <label className="text-[13px] text-white/40 mb-3 block">Amount (USDC)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full rounded-lg border border-white/10 bg-transparent p-4 pr-20 text-[18px] font-light text-white placeholder:text-white/20 focus:border-white/25 focus:outline-none transition-colors"
                    />
                    <button
                      onClick={() => {
                        const bal = balances[selectedChain?.name || ""] || "0";
                        setAmount(bal);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[#E9A13F] hover:underline"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="flex items-center justify-center gap-4 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[18px]">{selectedChain?.icon}</span>
                    <span className="text-[14px] text-white/60">{selectedChain?.name}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#E9A13F]" />
                  <div className="flex items-center gap-2">
                    <span className="text-[18px]">🔵</span>
                    <span className="text-[14px] text-white/60">Arc</span>
                  </div>
                </div>

                <button
                  onClick={handleEstimate}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="w-full btn-primary justify-center py-4 text-[16px] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {step === "confirm" && (
              <div className="space-y-6">
                <h3 className="text-[18px] font-light text-white">Confirm bridge</h3>

                <div className="space-y-3">
                  <div className="flex justify-between py-3 border-b border-white/[0.06]">
                    <span className="text-[13px] text-white/40">From</span>
                    <span className="text-[13px] text-white flex items-center gap-2">
                      {selectedChain?.icon} {selectedChain?.name}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/[0.06]">
                    <span className="text-[13px] text-white/40">To</span>
                    <span className="text-[13px] text-white flex items-center gap-2">
                      🔵 Arc Testnet
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/[0.06]">
                    <span className="text-[13px] text-white/40">Amount</span>
                    <span className="mono text-[13px] text-white">{amount} USDC</span>
                  </div>
                  {estimate && (
                    <>
                      <div className="flex justify-between py-3 border-b border-white/[0.06]">
                        <span className="text-[13px] text-white/40">Bridge Fee</span>
                        <span className="mono text-[13px] text-white">
                          {estimate.fee || "~0.01"} USDC
                        </span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-white/[0.06]">
                        <span className="text-[13px] text-white/40">Estimated Time</span>
                        <span className="text-[13px] text-white">
                          {estimate.estimatedTime || "~30 seconds"}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between py-3">
                    <span className="text-[14px] font-medium text-white">You Receive</span>
                    <span className="mono text-[14px] text-amber">
                      ~{amount} USDC on Arc
                    </span>
                  </div>
                </div>

                {bridgeError && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                    <div className="text-[13px] text-red-400">{bridgeError}</div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep("select")} className="flex-1 btn-outline justify-center">
                    Back
                  </button>
                  <button
                    onClick={handleBridge}
                    disabled={isBridging}
                    className="flex-1 btn-primary justify-center disabled:opacity-50"
                  >
                    {isBridging ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Bridging...</>
                    ) : (
                      <>Bridge Now</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === "processing" && (
              <div className="text-center py-10">
                <Loader2 className="w-12 h-12 text-[#E9A13F] animate-spin mx-auto mb-6" />
                <h3 className="text-[20px] font-light text-white mb-2">Bridging...</h3>
                <p className="text-[14px] text-white/40">
                  Transferring {amount} USDC from {selectedChain?.name} to Arc
                </p>
                <p className="text-[12px] text-white/20 mt-2">
                  This may take 15-60 seconds
                </p>
              </div>
            )}

            {step === "success" && (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-[20px] font-light text-white mb-2">Bridge Complete!</h3>
                <p className="text-[14px] text-white/40 mb-6">
                  {amount} USDC bridged to Arc Testnet
                </p>

                {txHash && (
                  <a
                    href={`https://testnet.arcscan.app/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[13px] text-[#E9A13F] hover:underline mb-6"
                  >
                    View Transaction <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                <div className="flex gap-3 max-w-[320px] mx-auto mt-6">
                  <button
                    onClick={() => {
                      setStep("select");
                      setAmount("");
                    }}
                    className="flex-1 btn-outline justify-center"
                  >
                    Bridge More
                  </button>
                  <a
                    href="/create"
                    className="flex-1 btn-primary justify-center inline-flex items-center gap-2"
                  >
                    Mint NFT <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
          <div className="rounded-xl border border-white/10 p-5">
            <Zap className="w-5 h-5 text-[#E9A13F] mb-3" />
            <div className="text-[14px] font-medium text-white mb-1">Instant</div>
            <p className="text-[12px] text-white/40">
              Circle Gateway enables near-instant cross-chain transfers
            </p>
          </div>
          <div className="rounded-xl border border-white/10 p-5">
            <Shield className="w-5 h-5 text-[#E9A13F] mb-3" />
            <div className="text-[14px] font-medium text-white mb-1">Secure</div>
            <p className="text-[12px] text-white/40">
              Powered by Circle&apos;s CCTP protocol — no wrapped tokens
            </p>
          </div>
          <div className="rounded-xl border border-white/10 p-5">
            <Globe className="w-5 h-5 text-[#E9A13F] mb-3" />
            <div className="text-[14px] font-medium text-white mb-1">Multi-Chain</div>
            <p className="text-[12px] text-white/40">
              Bridge from Ethereum, Base, Arbitrum, Optimism, Polygon, Avalanche
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-[11px] text-white/20 text-center mt-12">
          Powered by Circle App Kit • Unified Balance + Bridge • Arc Testnet
        </p>
      </div>
    </div>
  );
}
