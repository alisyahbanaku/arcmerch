import Link from "next/link";
import {
  Flame,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Layers,
} from "lucide-react";

// Mock data
const FEATURED = [
  { id: 1, title: "Neon Samurai", creator: "@arconomist", price: "25", edition: "1/10", product: "T-Shirt", burned: 3, color: "#9F72FF", emoji: "⚔️" },
  { id: 2, title: "Arc Galaxy", creator: "@builder0x", price: "30", edition: "1/50", product: "Hoodie", burned: 12, color: "#2F578C", emoji: "🌌" },
  { id: 3, title: "USDC Waves", creator: "@stabledev", price: "15", edition: "1/100", product: "Cap", burned: 45, color: "#2A9D8F", emoji: "🌊" },
  { id: 4, title: "Cyber Punk Cat", creator: "@nekoartist", price: "20", edition: "1/25", product: "T-Shirt", burned: 8, color: "#E9A13F", emoji: "🐱" },
  { id: 5, title: "Blockchain City", creator: "@web3painter", price: "50", edition: "1/10", product: "Poster", burned: 2, color: "#E76F51", emoji: "🏙️" },
  { id: 6, title: "DeFi Dreams", creator: "@cryptomind", price: "35", edition: "1/20", product: "Hoodie", burned: 7, color: "#7B68EE", emoji: "💭" },
];

const STEPS = [
  { num: "01", title: "Create with AI", desc: "Describe your design. AI generates it. Choose product type — t-shirt, hoodie, cap, mug, poster." },
  { num: "02", title: "Mint as NFT", desc: "Your design becomes an ERC-721 on Arc. Set price in USDC, set edition size, list on marketplace." },
  { num: "03", title: "Trade or Burn", desc: "Hold to collect. Trade for profit. Burn to get HD file or physical print shipped to your door." },
];

export default function Home() {
  return (
    <>
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden bg-black">
        {/* Subtle gradient accent */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(233,161,63,0.06)_0%,transparent_60%)]" />

        <div className="relative mx-auto max-w-[1280px] px-6 lg:px-10 py-[120px] md:py-[180px]">
          {/* Label */}
          <div className="section-label mb-8">
            {"{ ARCMERCH }"}
          </div>

          {/* Headline — arc.io style: light weight, uppercase, massive */}
          <h1 className="text-[48px] md:text-[72px] lg:text-[88px] font-light uppercase tracking-[-0.03em] leading-[0.95] text-white max-w-[900px]">
            AI Merch
            <br />
            <span className="text-gradient font-normal">on Chain</span>
          </h1>

          {/* Sub */}
          <p className="mt-8 text-[17px] text-white/50 leading-relaxed max-w-[520px]">
            Create merchandise designs with AI. Mint as NFTs on Arc. 
            Trade, collect, or burn to redeem physical products — all in USDC.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/create" className="btn-primary">
              Start creating
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/marketplace" className="btn-outline">
              Explore marketplace
            </Link>
          </div>

          {/* Core loop — subtle */}
          <div className="mt-16 flex items-center gap-2 text-[13px] text-white/25">
            <span>Create</span>
            <span className="text-white/10">→</span>
            <span>Mint</span>
            <span className="text-white/10">→</span>
            <span>Trade</span>
            <span className="text-white/10">→</span>
            <span className="text-amber">Burn</span>
            <span className="text-white/10">→</span>
            <span>Print</span>
          </div>
        </div>
      </section>

      {/* ═══════════ STATS ═══════════ */}
      <section className="border-t border-b border-white/[0.06] bg-black">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { label: "Designs created", value: "1,247" },
              { label: "NFTs minted", value: "3,891" },
              { label: "Physical orders", value: "892" },
              { label: "Active creators", value: "156" },
            ].map((stat, i) => (
              <div key={stat.label} className={`py-12 px-6 ${i > 0 ? 'border-l border-white/[0.06]' : ''}`}>
                <div className="section-label mb-3">{`{ ${stat.label.toUpperCase()} }`}</div>
                <div className="stat-number">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURED DESIGNS ═══════════ */}
      <section className="bg-white text-black">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-[100px] md:py-[140px]">
          <div className="section-label mb-3 text-black/30">{"{ FEATURED }"}</div>
          <h2 className="text-[40px] md:text-[56px] font-light tracking-[-0.02em] text-black mb-4 max-w-[600px]">
            Trending designs on ArcMerch
          </h2>
          <p className="text-[16px] text-black/40 mb-14 max-w-[480px]">
            AI-generated merchandise NFTs, traded and redeemed on Arc blockchain.
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED.map((d) => (
              <div key={d.id} className="group cursor-pointer">
                {/* Design preview */}
                <div
                  className="relative aspect-[4/3] rounded-xl overflow-hidden flex items-center justify-center"
                  style={{ backgroundColor: d.color }}
                >
                  <span className="text-[64px]">{d.emoji}</span>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="mono text-[11px] bg-black/40 backdrop-blur-sm text-white px-2 py-1 rounded-md">
                      {d.edition}
                    </span>
                    <span className="text-[11px] bg-black/40 backdrop-blur-sm text-white px-2 py-1 rounded-md">
                      {d.product}
                    </span>
                  </div>

                  {d.burned > 0 && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white px-2 py-1 rounded-md text-[11px]">
                      <Flame className="h-3 w-3" />
                      {d.burned}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="mt-4 px-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-[16px] font-medium text-black group-hover:text-amber transition-colors duration-150">
                        {d.title}
                      </h3>
                      <p className="text-[13px] text-black/40 mt-0.5">{d.creator}</p>
                    </div>
                    <span className="mono text-[15px] font-medium text-black">
                      {d.price} USDC
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link href="/marketplace" className="inline-flex items-center gap-2 text-[14px] text-black/50 hover:text-black transition-colors duration-150 group">
              View all designs
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="bg-black">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-[100px] md:py-[140px]">
          <div className="section-label mb-3">{"{ HOW IT WORKS }"}</div>
          <h2 className="text-[40px] md:text-[56px] font-light tracking-[-0.02em] text-white mb-16 max-w-[500px]">
            From idea to physical product
          </h2>

          <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.num} className={`py-8 md:py-0 md:px-8 ${i < 2 ? 'md:border-r md:border-white/[0.06]' : ''}`}>
                <div className="mono text-[13px] text-amber mb-4">{step.num}</div>
                <h3 className="text-[22px] font-light text-white mb-3">{step.title}</h3>
                <p className="text-[14px] text-white/40 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ BURN MECHANIC ═══════════ */}
      <section className="bg-white text-black">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-[100px] md:py-[140px]">
          <div className="grid items-start gap-16 lg:grid-cols-2">
            <div>
              <div className="section-label mb-3 text-black/30">{"{ BURN-TO-REDEEM }"}</div>
              <h2 className="text-[40px] md:text-[56px] font-light tracking-[-0.02em] text-black mb-6">
                Every burn
                <br />
                makes remaining
                <br />
                <span className="text-amber font-normal">NFTs rarer</span>
              </h2>
              <p className="text-[16px] text-black/40 leading-relaxed mb-10 max-w-[440px]">
                When you burn an NFT to redeem an HD file or physical print, 
                that token is destroyed forever. Supply decreases. Scarcity increases.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 rounded-xl border border-black/[0.06]">
                  <Shield className="h-5 w-5 text-black/30 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[15px] font-medium text-black">Soulbound Certificate</div>
                    <div className="text-[13px] text-black/40 mt-1">Non-transferable proof of original ownership</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 rounded-xl border border-black/[0.06]">
                  <TrendingUp className="h-5 w-5 text-black/30 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[15px] font-medium text-black">Deflationary Value</div>
                    <div className="text-[13px] text-black/40 mt-1">100 → 50 → 20. Each burn = remaining NFTs 2-5× rarer</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Supply visualization */}
            <div className="rounded-xl border border-black/[0.06] p-8">
              <div className="section-label mb-8 text-black/30">{"{ SUPPLY OVER TIME }"}</div>
              
              <div className="space-y-6">
                {[
                  { label: "Launch", supply: 100, pct: 100, color: "bg-black" },
                  { label: "20 burns", supply: 80, pct: 80, color: "bg-black/70" },
                  { label: "50 burns", supply: 50, pct: 50, color: "bg-amber" },
                  { label: "80 burns", supply: 20, pct: 20, color: "bg-red-500" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between mb-2">
                      <span className="text-[13px] text-black/40">{item.label}</span>
                      <span className="mono text-[13px] text-black">{item.supply} NFTs</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-black/[0.04]">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4">
                {[
                  { emoji: "🔒", label: "Hold", desc: "Trade & collect" },
                  { emoji: "🔥", label: "Burn HD", desc: "Get HD file" },
                  { emoji: "📦", label: "Order", desc: "Print & ship" },
                ].map((opt) => (
                  <div key={opt.label} className="text-center p-4 rounded-lg border border-black/[0.06]">
                    <div className="text-[24px] mb-2">{opt.emoji}</div>
                    <div className="text-[13px] font-medium text-black">{opt.label}</div>
                    <div className="text-[11px] text-black/30 mt-0.5">{opt.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ WHY ARC ═══════════ */}
      <section className="bg-black">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-[100px] md:py-[140px]">
          <div className="section-label mb-3">{"{ WHY ARC }"}</div>
          <h2 className="text-[40px] md:text-[56px] font-light tracking-[-0.02em] text-white mb-16 max-w-[500px]">
            Purpose-built for stablecoin commerce
          </h2>

          <div className="grid grid-cols-1 gap-px bg-white/[0.06] rounded-xl overflow-hidden md:grid-cols-2">
            {[
              { icon: "💰", title: "USDC Native Gas", desc: "Pay gas in USDC — no volatile ETH. Predictable, dollar-based costs." },
              { icon: "⚡", title: "Sub-Second Finality", desc: "Instant mints and trades. Deterministic settlement the moment it happens." },
              { icon: "🔗", title: "EVM Compatible", desc: "Standard Solidity. Works with Foundry, Hardhat, viem, ethers.js." },
              { icon: "🤖", title: "Agentic Economy", desc: "ERC-8004 agent identity + ERC-8183 job settlement for AI agents." },
            ].map((item) => (
              <div key={item.title} className="bg-black p-8 md:p-10">
                <div className="text-[28px] mb-5">{item.icon}</div>
                <h3 className="text-[18px] font-medium text-white mb-2">{item.title}</h3>
                <p className="text-[14px] text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="bg-white text-black border-t border-black/[0.06]">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-[100px] md:py-[140px] text-center">
          <div className="section-label mb-3 text-black/30">{"{ GET STARTED }"}</div>
          <h2 className="text-[40px] md:text-[56px] font-light tracking-[-0.02em] text-black mb-4">
            Ready to create?
          </h2>
          <p className="text-[16px] text-black/40 mb-10 max-w-[420px] mx-auto">
            Connect wallet, describe your design, mint your first 
            AI-generated merchandise NFT — under 2 minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/create" className="btn-primary bg-black text-white hover:bg-black/80">
              Start creating
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/marketplace" className="btn-outline border-black/20 text-black hover:border-black/40">
              Explore marketplace
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
