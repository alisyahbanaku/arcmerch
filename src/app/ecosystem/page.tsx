"use client";

import { useState } from "react";
import { Bot, Shield, Star, Truck, DollarSign, CheckCircle, Loader2, ExternalLink, Zap } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { useActiveWallet } from "@/lib/wallet-context";
import { useRegisterAgent, useGiveReputation, useCreateJob, useJobStatus, useAgentReputation } from "@/hooks/useArcEcosystem";
import { ARCMERCH_AGENT_METADATA, REPUTATION_TAGS, createPrintJobMetadata } from "@/lib/agent-metadata";
import { IDENTITY_REGISTRY, REPUTATION_REGISTRY, AGENTIC_COMMERCE, USDC_ADDRESS } from "@/lib/arc-ecosystem";

export default function EcosystemPage() {
  const { authenticated, login } = usePrivy();
  const { activeWallet } = useActiveWallet();
  const address = activeWallet?.address || "";
  const isConnected = authenticated && !!address;

  // Hooks
  const { register, isPending: isRegistering, hash: registerHash, agentId, error: registerError } = useRegisterAgent();
  const { giveFeedback, isPending: isRating, hash: ratingHash, error: ratingError } = useGiveReputation();
  const { createJob, isPending: isCreatingJob, hash: jobHash, jobId, error: jobError } = useCreateJob();
  const { data: reputation, fetch: fetchReputation } = useAgentReputation(agentId || undefined);

  // Local state
  const [activeTab, setActiveTab] = useState<"agent" | "reputation" | "fulfillment" | "payment">("agent");

  const tabs = [
    { id: "agent" as const, label: "AI Agent", icon: Bot, desc: "ERC-8004" },
    { id: "reputation" as const, label: "Reputation", icon: Star, desc: "ERC-8004" },
    { id: "fulfillment" as const, label: "Fulfillment", icon: Truck, desc: "ERC-8183" },
    { id: "payment" as const, label: "USDC Pay", icon: DollarSign, desc: "Native" },
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(233,161,63,0.04)_0%,transparent_50%)] pointer-events-none" />

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
        {/* Header */}
        <div className="section-label mb-3">{`{ ARC ECOSYSTEM }`}</div>
        <h1 className="text-[28px] sm:text-[36px] md:text-[56px] font-light tracking-[-0.02em] text-white mb-3">
          On-chain integrations
        </h1>
        <p className="text-[16px] text-white/70 mb-4">
          ArcMerch leverages Arc&apos;s native protocols for AI agent identity, reputation, job settlement, and USDC payments.
        </p>

        {/* Contract addresses */}
        <div className="flex flex-wrap gap-3 mb-10">
          {[
            { label: "Identity", addr: IDENTITY_REGISTRY },
            { label: "Reputation", addr: REPUTATION_REGISTRY },
            { label: "Commerce", addr: AGENTIC_COMMERCE },
          ].map((c) => (
            <a
              key={c.label}
              href={`https://testnet.arcscan.app/address/${c.addr}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-[12px] text-white/70 hover:border-[#E9A13F]/30 hover:text-[#E9A13F] transition-colors"
            >
              <span className="text-white/50">{c.label}:</span>
              <span className="mono">{c.addr.slice(0, 8)}...{c.addr.slice(-4)}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-3 text-[13px] font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#E9A13F] text-black"
                  : "border border-white/10 text-white/70 hover:border-white/20 hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span className={`text-[10px] ${activeTab === tab.id ? "text-black/60" : "text-white/50"}`}>
                {tab.desc}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          {/* ── AI Agent Tab ── */}
          {activeTab === "agent" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Bot className="w-6 h-6 text-[#E9A13F]" />
                <h2 className="text-[20px] font-light">AI Design Agent — ERC-8004</h2>
              </div>
              <p className="text-[14px] text-white/70 leading-relaxed">
                Register the ArcMerch AI Design Generator as an on-chain agent with verifiable identity.
                Every design generated gets provenance tracked through the agent&apos;s identity NFT.
              </p>

              {/* Agent metadata preview */}
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 space-y-2">
                <div className="text-[11px] text-white/35 uppercase tracking-wider">Agent Metadata</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
                  <div><span className="text-white/70">Name:</span> <span className="text-white">{ARCMERCH_AGENT_METADATA.name}</span></div>
                  <div><span className="text-white/70">Type:</span> <span className="text-white">{ARCMERCH_AGENT_METADATA.agent_type}</span></div>
                  <div><span className="text-white/70">Version:</span> <span className="text-white mono">{ARCMERCH_AGENT_METADATA.version}</span></div>
                  <div><span className="text-white/70">Chain:</span> <span className="text-white">{ARCMERCH_AGENT_METADATA.properties.chain}</span></div>
                </div>
                <div className="mt-2">
                  <span className="text-white/70 text-[13px]">Capabilities:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {ARCMERCH_AGENT_METADATA.capabilities.map((cap) => (
                      <span key={cap} className="text-[11px] bg-white/5 border border-white/10 rounded px-2 py-1 text-white/60">{cap}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Register button */}
              {agentId ? (
                <div className="flex items-center gap-3 rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-[14px] text-green-400">Agent Registered</div>
                    <div className="text-[12px] text-white/70 mono">Agent ID: #{agentId.toString()}</div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (!isConnected) { login(); return; }
                    register("ipfs://arcmerch-agent-metadata-v1");
                  }}
                  disabled={isRegistering}
                  className="rounded-lg bg-[#E9A13F] text-black px-6 py-3 text-[14px] font-medium hover:bg-[#E9A13F]/80 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isRegistering ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                  {isRegistering ? "Registering..." : "Register AI Agent"}
                </button>
              )}
              {registerError && <p className="text-[13px] text-red-400">{registerError}</p>}
              {registerHash && (
                <a href={`https://testnet.arcscan.app/tx/${registerHash}`} target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#E9A13F] hover:underline flex items-center gap-1">
                  View transaction <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          {/* ── Reputation Tab ── */}
          {activeTab === "reputation" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-6 h-6 text-[#E9A13F]" />
                <h2 className="text-[20px] font-light">Reputation System — ERC-8004</h2>
              </div>
              <p className="text-[14px] text-white/70 leading-relaxed">
                Rate creators and printers on-chain. Reputation scores are recorded via the ReputationRegistry
                and cannot be self-attested — only external validators can give feedback.
              </p>

              {/* Reputation tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(REPUTATION_TAGS).map(([key, tag]) => (
                  <div key={key} className="rounded-lg border border-white/10 bg-white/[0.02] p-4 flex items-center justify-between">
                    <div>
                      <div className="text-[13px] text-white">{tag.replace(/_/g, " ")}</div>
                      <div className="text-[11px] text-white/50 mono">{key}</div>
                    </div>
                    <button
                      onClick={() => {
                        if (!isConnected) { login(); return; }
                        if (agentId) giveFeedback(agentId, 95, tag, "Great quality");
                      }}
                      disabled={isRating || !agentId}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-[11px] text-white/70 hover:border-[#E9A13F]/30 hover:text-[#E9A13F] transition-colors disabled:opacity-30"
                    >
                      {isRating ? "..." : "+1"}
                    </button>
                  </div>
                ))}
              </div>

              {/* Score display */}
              {reputation && (
                <div className="rounded-lg border border-[#E9A13F]/20 bg-[#E9A13F]/5 p-4">
                  <div className="text-[11px] text-white/35 uppercase mb-2">Agent Reputation</div>
                  <div className="flex gap-6">
                    <div>
                      <div className="text-[24px] font-light text-[#E9A13F]">{reputation.totalScore.toString()}</div>
                      <div className="text-[11px] text-white/70">Total Score</div>
                    </div>
                    <div>
                      <div className="text-[24px] font-light text-white">{reputation.feedbackCount.toString()}</div>
                      <div className="text-[11px] text-white/70">Feedbacks</div>
                    </div>
                  </div>
                </div>
              )}
              {ratingError && <p className="text-[13px] text-red-400">{ratingError}</p>}
            </div>
          )}

          {/* ── Fulfillment Tab ── */}
          {activeTab === "fulfillment" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Truck className="w-6 h-6 text-[#E9A13F]" />
                <h2 className="text-[20px] font-light">Print Fulfillment — ERC-8183</h2>
              </div>
              <p className="text-[14px] text-white/70 leading-relaxed">
                Burn-to-redeem flow with USDC escrow. When you burn an NFT, a print job is created on-chain.
                The printer submits proof of delivery, and USDC is released from escrow.
              </p>

              {/* Flow diagram */}
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-6">
                <div className="text-[11px] text-white/35 uppercase tracking-wider mb-4">Fulfillment Flow</div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-2 text-[13px]">
                  {[
                    { step: "1", label: "Burn NFT", color: "text-red-400" },
                    { step: "2", label: "Create Job", color: "text-blue-400" },
                    { step: "3", label: "Escrow USDC", color: "text-[#E9A13F]" },
                    { step: "4", label: "Print & Ship", color: "text-purple-400" },
                    { step: "5", label: "Confirm Delivery", color: "text-green-400" },
                    { step: "6", label: "Release Payment", color: "text-green-400" },
                  ].map((s, i) => (
                    <div key={s.step} className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-[10px] ${s.color}`}>
                        {s.step}
                      </div>
                      <span className="text-white/60">{s.label}</span>
                      {i < 5 && <span className="text-white/20 hidden sm:inline">→</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Create job demo */}
              <button
                onClick={() => {
                  if (!isConnected) { login(); return; }
                  const metadata = createPrintJobMetadata({
                    tokenId: 1,
                    productType: "T-Shirt",
                    designTitle: "Arc Logo Tee",
                    size: "L",
                    color: "Black",
                  });
                  createJob(
                    "0x0000000000000000000000000000000000000001", // placeholder printer
                    "Print Arc Logo Tee - Size L, Black",
                    metadata,
                    25 // 25 USDC
                  );
                }}
                disabled={isCreatingJob}
                className="rounded-lg bg-[#E9A13F] text-black px-6 py-3 text-[14px] font-medium hover:bg-[#E9A13F]/80 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isCreatingJob ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                {isCreatingJob ? "Creating Job..." : "Demo: Create Print Job"}
              </button>

              {jobId && (
                <div className="flex items-center gap-3 rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-[14px] text-green-400">Job Created & Funded</div>
                    <div className="text-[12px] text-white/70 mono">Job ID: #{jobId.toString()}</div>
                  </div>
                </div>
              )}
              {jobError && <p className="text-[13px] text-red-400">{jobError}</p>}
            </div>
          )}

          {/* ── USDC Payment Tab ── */}
          {activeTab === "payment" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-6 h-6 text-[#E9A13F]" />
                <h2 className="text-[20px] font-light">USDC Payments — Native</h2>
              </div>
              <p className="text-[14px] text-white/70 leading-relaxed">
                All transactions on ArcMerch are settled in USDC. Arc uses USDC as native gas token —
                no ETH needed. Fees are predictable and dollar-denominated.
              </p>

              {/* Payment info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                  <div className="text-[11px] text-white/35 uppercase mb-2">Mint Price</div>
                  <div className="text-[20px] font-light text-[#E9A13F]">5 USDC</div>
                  <div className="text-[12px] text-white/50 mt-1">Per NFT (configurable by owner)</div>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                  <div className="text-[11px] text-white/35 uppercase mb-2">Gas Cost</div>
                  <div className="text-[20px] font-light text-white">~$0.001</div>
                  <div className="text-[12px] text-white/50 mt-1">USDC-denominated, predictable</div>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                  <div className="text-[11px] text-white/35 uppercase mb-2">Royalties</div>
                  <div className="text-[20px] font-light text-white">5%</div>
                  <div className="text-[12px] text-white/50 mt-1">EIP-2981, paid to creator</div>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                  <div className="text-[11px] text-white/35 uppercase mb-2">Settlement</div>
                  <div className="text-[20px] font-light text-white">&lt;1s</div>
                  <div className="text-[12px] text-white/50 mt-1">Deterministic finality</div>
                </div>
              </div>

              {/* Payment flow */}
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <div className="text-[11px] text-white/35 uppercase tracking-wider mb-3">Payment Flow</div>
                <div className="space-y-2 text-[13px] text-white/60">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-[#E9A13F]" />
                    <span><code className="text-[#E9A13F]">approve()</code> — User approves USDC spending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-[#E9A13F]" />
                    <span><code className="text-[#E9A13F]">mint()</code> — Contract transfers USDC to treasury</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-[#E9A13F]" />
                    <span><code className="text-[#E9A13F]">burn()</code> — NFT destroyed, triggers fulfillment job</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-[#E9A13F]" />
                    <span><code className="text-[#E9A13F]">complete()</code> — Escrow released to printer</span>
                  </div>
                </div>
              </div>

              {/* USDC contract link */}
              <a
                href={`https://testnet.arcscan.app/address/${USDC_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[13px] text-[#E9A13F] hover:underline"
              >
                USDC Contract: {USDC_ADDRESS.slice(0, 10)}...{USDC_ADDRESS.slice(-4)} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Architecture overview */}
        <div className="mt-12 rounded-xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          <div className="text-[11px] text-white/35 uppercase tracking-wider mb-4">Architecture</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="rounded-lg border border-white/10 p-4">
              <Bot className="w-8 h-8 text-[#E9A13F] mx-auto mb-2" />
              <div className="text-[14px] text-white font-medium">ERC-8004</div>
              <div className="text-[12px] text-white/70 mt-1">AI Agent Identity + Reputation</div>
              <div className="text-[11px] text-white/50 mt-2 mono">IdentityRegistry</div>
              <div className="text-[11px] text-white/50 mono">ReputationRegistry</div>
            </div>
            <div className="rounded-lg border border-white/10 p-4">
              <Truck className="w-8 h-8 text-[#E9A13F] mx-auto mb-2" />
              <div className="text-[14px] text-white font-medium">ERC-8183</div>
              <div className="text-[12px] text-white/70 mt-1">Job Settlement + Escrow</div>
              <div className="text-[11px] text-white/50 mt-2 mono">AgenticCommerce</div>
              <div className="text-[11px] text-white/50 mono">USDC Escrow</div>
            </div>
            <div className="rounded-lg border border-white/10 p-4">
              <Shield className="w-8 h-8 text-[#E9A13F] mx-auto mb-2" />
              <div className="text-[14px] text-white font-medium">ERC-721</div>
              <div className="text-[12px] text-white/70 mt-1">NFT + Burn-to-Redeem</div>
              <div className="text-[11px] text-white/50 mt-2 mono">ArcMerchNFT</div>
              <div className="text-[11px] text-white/50 mono">EIP-2981 Royalties</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
