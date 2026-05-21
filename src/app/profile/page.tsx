"use client";

import { Flame, Award, Layers } from "lucide-react";

const CREATOR = {
  handle: "@arconomist", verified: true, wallet: "0x7f2a...3d8c",
  bio: "Arc ecosystem analyst & designer. Building the future of merchandise on stablecoin-native chains.",
  followers: "15.2K", totalDesigns: 47, totalSales: 234, totalEarned: "5,840",
  reputation: 720, tier: "Pro", tierEmoji: "⭐",
  avatar: "🧑‍💻",
};

const MY_DESIGNS = [
  { id: 1, title: "Neon Samurai", price: "25", edition: "1/10", burned: 3, remaining: 7, color: "#9F72FF", emoji: "⚔️" },
  { id: 2, title: "Arc Genesis", price: "50", edition: "1/5", burned: 1, remaining: 4, color: "#2F578C", emoji: "🌟" },
  { id: 3, title: "USDC Shield", price: "15", edition: "1/50", burned: 12, remaining: 38, color: "#2A9D8F", emoji: "🛡️" },
];

const HOLDINGS = [
  { id: 101, title: "Crypto Tiger", creator: "@nftbeast", price: "45", color: "#F59E0B", emoji: "🐯" },
  { id: 102, title: "Moon Phase", creator: "@lunartist", price: "18", color: "#6B7280", emoji: "🌙" },
];

export default function ProfilePage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-16">
        {/* Profile header */}
        <div className="section-label mb-3">{"{ PROFILE }"}</div>
        
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-start mb-16">
          {/* Avatar */}
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-surface border border-white/10 text-[40px]">
            {CREATOR.avatar}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-[32px] font-light text-white">{CREATOR.handle}</h1>
              {CREATOR.verified && (
                <span className="mono text-[11px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded">✓ Verified</span>
              )}
              <span className="mono text-[11px] bg-amber/10 text-amber px-2 py-0.5 rounded">
                {CREATOR.tierEmoji} {CREATOR.tier}
              </span>
            </div>
            <p className="mono text-[12px] text-white/20 mt-1">{CREATOR.wallet}</p>
            <p className="text-[14px] text-white/40 mt-3 max-w-[480px]">{CREATOR.bio}</p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8 mt-6">
              {[
                { label: "Followers", value: CREATOR.followers },
                { label: "Designs", value: String(CREATOR.totalDesigns) },
                { label: "Sales", value: String(CREATOR.totalSales) },
                { label: "Earned", value: `${CREATOR.totalEarned} USDC`, accent: true },
              ].map((s) => (
                <div key={s.label}>
                  <div className={`text-[20px] font-light ${s.accent ? "text-amber" : "text-white"}`}>{s.value}</div>
                  <div className="text-[12px] text-white/30">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Reputation */}
          <div className="rounded-xl border border-white/10 p-6 min-w-[160px] text-center">
            <Award className="mx-auto h-5 w-5 text-amber mb-3" />
            <div className="stat-number text-[36px]">{CREATOR.reputation}</div>
            <div className="text-[12px] text-white/30 mb-3">Reputation</div>
            <div className="h-1 w-full rounded-full bg-white/[0.06]">
              <div className="h-full rounded-full bg-amber" style={{ width: `${(CREATOR.reputation / 1000) * 100}%` }} />
            </div>
            <div className="text-[11px] text-white/20 mt-2">{1000 - CREATOR.reputation} to Elite 🏆</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-white/[0.06] mb-10">
          <button className="pb-4 text-[14px] font-medium text-white border-b-2 border-amber -mb-px">
            My Designs ({MY_DESIGNS.length})
          </button>
          <button className="pb-4 text-[14px] text-white/30 hover:text-white/60 transition-colors">
            Holdings ({HOLDINGS.length})
          </button>
          <button className="pb-4 text-[14px] text-white/30 hover:text-white/60 transition-colors">
            Burn History
          </button>
        </div>

        {/* My Designs */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {MY_DESIGNS.map((d) => (
            <div key={d.id} className="group cursor-pointer">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden flex items-center justify-center" style={{ backgroundColor: d.color }}>
                <span className="text-[64px]">{d.emoji}</span>
                <div className="absolute top-3 left-3">
                  <span className="mono text-[11px] bg-black/40 backdrop-blur-sm text-white px-2 py-1 rounded-md">{d.edition}</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex justify-between">
                  <span className="flex items-center gap-1 bg-green-500/60 backdrop-blur-sm text-white px-2 py-1 rounded-md text-[11px]">
                    <Layers className="h-3 w-3" />{d.remaining} left
                  </span>
                  <span className="flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white px-2 py-1 rounded-md text-[11px]">
                    <Flame className="h-3 w-3" />{d.burned}
                  </span>
                </div>
              </div>
              <div className="mt-4 px-1 flex items-center justify-between">
                <div>
                  <h3 className="text-[16px] font-medium text-white group-hover:text-amber transition-colors">{d.title}</h3>
                </div>
                <span className="mono text-[15px] text-white">{d.price} USDC</span>
              </div>
            </div>
          ))}
        </div>

        {/* Holdings */}
        <div className="section-label mb-6">{"{ MY HOLDINGS }"}</div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {HOLDINGS.map((nft) => (
            <div key={nft.id} className="flex items-center gap-5 rounded-xl border border-white/[0.06] p-5">
              <div className="h-14 w-14 rounded-lg flex items-center justify-center text-[32px]" style={{ backgroundColor: nft.color }}>
                {nft.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-medium text-white">{nft.title}</h3>
                <p className="text-[12px] text-white/30">by {nft.creator}</p>
              </div>
              <div className="text-right">
                <div className="mono text-[15px] text-white">{nft.price} USDC</div>
                <div className="flex gap-2 mt-2">
                  <button className="rounded-md bg-red-500/10 text-red-400 px-2.5 py-1 text-[11px] font-medium hover:bg-red-500/20 transition-colors">
                    🔥 Burn
                  </button>
                  <button className="rounded-md bg-blue-500/10 text-blue-400 px-2.5 py-1 text-[11px] font-medium hover:bg-blue-500/20 transition-colors">
                    📦 Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
