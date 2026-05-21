"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, ExternalLink, Copy, Check } from "lucide-react";

const TOC = [
  { id: "abstract", label: "Abstract", n: "00" },
  { id: "problem", label: "Problem Statement", n: "01" },
  { id: "solution", label: "Solution", n: "02" },
  { id: "core-loop", label: "Core Loop", n: "03" },
  { id: "why-arc", label: "Why Arc", n: "04" },
  { id: "architecture", label: "Architecture", n: "05" },
  { id: "contracts", label: "Smart Contracts", n: "06" },
  { id: "burn", label: "Burn-to-Redeem", n: "07" },
  { id: "identity", label: "Creator Identity", n: "08" },
  { id: "reputation", label: "Reputation System", n: "09" },
  { id: "ai-engine", label: "AI Design Engine", n: "10" },
  { id: "fulfillment", label: "Fulfillment", n: "11" },
  { id: "revenue", label: "Revenue & Tokenomics", n: "12" },
  { id: "stack", label: "Technical Stack", n: "13" },
  { id: "security", label: "Security", n: "14" },
  { id: "roadmap", label: "Roadmap", n: "15" },
  { id: "grant", label: "Grant Alignment", n: "16" },
  { id: "team", label: "Team", n: "17" },
];

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="text-white/20 hover:text-white/50 transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function Section({ id, n, title, children }: { id: string; n: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-4 mb-6">
        <span className="font-mono text-[13px] text-[#E9A13F]/60">{n}</span>
        <h2 className="text-[28px] md:text-[36px] font-light tracking-[-0.02em] text-white">{title}</h2>
      </div>
      <div className="space-y-4 text-[15px] leading-[1.75] text-white/60">
        {children}
      </div>
    </section>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="my-6 space-y-0">
      {rows.map((row, i) => (
        <div key={i} className={`grid gap-4 py-3 ${i === 0 ? "border-b border-white/10" : "border-b border-white/[0.04]"}`}
          style={{ gridTemplateColumns: `repeat(${headers.length}, 1fr)` }}
        >
          {row.map((cell, j) => (
            <div key={j} className={`text-[13px] ${i === 0 ? "text-white/40 font-medium" : "text-white/60"}`}>
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <div className="relative my-6 rounded-lg border border-white/[0.06] bg-white/[0.02] p-5 overflow-x-auto">
      <pre className="text-[12px] font-mono leading-[1.6] text-white/50 whitespace-pre">{children}</pre>
    </div>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return <span className="text-[#E9A13F]">{children}</span>;
}

export default function MerchpaperPage() {
  const [activeSection, setActiveSection] = useState("");

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero */}
      <div className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-[900px] px-6 lg:px-10 py-20">
          <div className="section-label mb-4">{"{ MERCHPAPER }"}</div>
          <h1 className="text-[48px] md:text-[64px] font-light tracking-[-0.03em] text-white leading-[1.05] mb-6">
            ArcMerch
          </h1>
          <p className="text-[18px] text-white/40 max-w-[560px] leading-[1.6] mb-8">
            The Economic Operating System for AI-Powered Merchandise on Arc Blockchain
          </p>
          <div className="flex flex-wrap gap-4 text-[12px] font-mono text-white/30">
            <span className="px-3 py-1.5 rounded border border-white/10">v1.0 · May 2026</span>
            <span className="px-3 py-1.5 rounded border border-white/10">Arc Testnet · 5042002</span>
            <span className="px-3 py-1.5 rounded border border-[#E9A13F]/20 text-[#E9A13F]/60">Grant Application</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[900px] px-6 lg:px-10 py-16">
        {/* TOC */}
        <nav className="mb-20">
          <div className="text-[11px] uppercase tracking-[0.15em] text-white/20 mb-6">Table of Contents</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-1">
            {TOC.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="flex items-center gap-3 py-2 text-[14px] text-white/40 hover:text-white transition-colors group"
              >
                <span className="font-mono text-[11px] text-white/15 group-hover:text-[#E9A13F]/60 w-6">{item.n}</span>
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        {/* 00 — Abstract */}
        <Section id="abstract" n="00" title="Abstract">
          <p>
            ArcMerch is an <Highlight>AI-powered merchandise marketplace</Highlight> built natively on Arc — Circle&apos;s L1 blockchain where USDC is the native gas token. The protocol enables anyone to generate merchandise designs using AI, mint them as NFTs (ERC-721), trade them on a marketplace, and redeem physical products through a <Highlight>burn-to-redeem</Highlight> mechanic.
          </p>
          <p>
            By combining AI generation, NFT ownership, and print-on-demand fulfillment, ArcMerch creates a closed-loop economic system where digital creativity becomes physical goods — all settled in USDC on Arc&apos;s sub-second finality infrastructure.
          </p>
          <div className="mt-6 rounded-lg border border-[#E9A13F]/10 bg-[#E9A13F]/[0.03] p-5">
            <div className="text-[13px] font-medium text-[#E9A13F] mb-2">Core Innovation</div>
            <p className="text-[14px] text-white/50 leading-[1.7]">
              Every NFT has a lifecycle endpoint. Holders choose: <strong className="text-white/70">trade it</strong> (speculative value), <strong className="text-white/70">burn it for an HD file</strong> (utility), or <strong className="text-white/70">burn it for a physical print</strong> (real-world delivery). Every burn reduces supply, making remaining NFTs rarer — creating deflationary game theory.
            </p>
          </div>
        </Section>

        <div className="h-px bg-white/[0.04] my-16" />

        {/* 01 — Problem */}
        <Section id="problem" n="01" title="Problem Statement">
          <h3 className="text-[20px] font-light text-white mt-8 mb-4">The Creator-Merchandise Gap</h3>
          <p>Today, turning digital art into physical merchandise requires:</p>
          <ul className="list-none space-y-3 mt-4">
            {[
              "Design skills — most people can't create print-ready designs",
              "Platform lock-in — creators upload to Redbubble, Teespring, etc. and lose control",
              "No ownership — designs live on centralized platforms; creators don't own their work",
              "No secondary market — once printed, designs can't be resold as collectibles",
              "No provenance — anyone can copy a design; no on-chain proof of creation",
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[#E9A13F] mt-1">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-[20px] font-light text-white mt-10 mb-4">The NFT-to-Physical Disconnect</h3>
          <p>Existing NFT platforms focus on digital art. There&apos;s no seamless bridge between owning an NFT and getting a physical product, trading digital collectibles and redeeming real-world goods, or on-chain provenance and print-on-demand fulfillment.</p>

          <h3 className="text-[20px] font-light text-white mt-10 mb-4">The Identity Problem</h3>
          <p>Anonymous NFT mints lack trust. There&apos;s no way to know if a design was created by a known artist or a random wallet. Social proof — the thing that drives real-world art value — is absent from most NFT platforms.</p>
        </Section>

        <div className="h-px bg-white/[0.04] my-16" />

        {/* 02 — Solution */}
        <Section id="solution" n="02" title="Solution: ArcMerch">
          <Table
            headers={["Problem", "ArcMerch Solution"]}
            rows={[
              ["Problem", "ArcMerch Solution"],
              ["Design skills required", "AI generation — describe what you want, AI creates it"],
              ["Platform lock-in", "On-chain NFT ownership, portable across wallets"],
              ["No secondary market", "Built-in marketplace with royalty enforcement"],
              ["NFT-to-physical gap", "Burn-to-redeem: destroy NFT → get HD file or physical print"],
              ["No provenance", "Every NFT linked to creator's verified X identity"],
              ["No trust", "Reputation system with badge tiers"],
            ]}
          />
        </Section>

        <div className="h-px bg-white/[0.04] my-16" />

        {/* 03 — Core Loop */}
        <Section id="core-loop" n="03" title="Core Loop">
          <CodeBlock>{`CREATE ──→ MINT ──→ LIST ──→ TRADE ──→ BURN ──→ PRINT
  🤖        🖼️       🏪       💰        🔥       📦
AI Gen    ERC-721  Market   Buy/Sell  Redeem   Ship`}</CodeBlock>

          <h3 className="text-[20px] font-light text-white mt-8 mb-4">For Creators</h3>
          <ol className="list-decimal list-inside space-y-2 text-white/50">
            <li>Connect wallet on Arc testnet</li>
            <li>Connect X (Twitter) for verification</li>
            <li>Write a design prompt or upload custom artwork</li>
            <li>AI generates the design (or upload processed)</li>
            <li>Preview on product mockup</li>
            <li>Set price in USDC and edition size</li>
            <li>Mint as ERC-721 NFT on Arc</li>
            <li>Listed on ArcMerch marketplace</li>
          </ol>

          <h3 className="text-[20px] font-light text-white mt-8 mb-4">For Buyers</h3>
          <ol className="list-decimal list-inside space-y-2 text-white/50">
            <li>Browse marketplace gallery</li>
            <li>Purchase NFT with USDC</li>
            <li>Choose destiny:</li>
          </ol>
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { icon: "🔒", label: "HOLD", desc: "Keep in wallet, trade later, collect, earn royalty" },
              { icon: "🔥", label: "BURN → HD", desc: "Destroy NFT, receive 300dpi transparent PNG" },
              { icon: "📦", label: "ORDER PRINT", desc: "Destroy NFT, ArcMerch prints & ships physical product" },
            ].map((path) => (
              <div key={path.label} className="rounded-lg border border-white/[0.06] p-5 text-center">
                <div className="text-[28px] mb-3">{path.icon}</div>
                <div className="text-[14px] font-medium text-white mb-2">{path.label}</div>
                <div className="text-[12px] text-white/30 leading-[1.5]">{path.desc}</div>
              </div>
            ))}
          </div>
        </Section>

        <div className="h-px bg-white/[0.04] my-16" />

        {/* 04 — Why Arc */}
        <Section id="why-arc" n="04" title="Why Arc Blockchain">
          <div className="grid gap-4 mt-6">
            {[
              { title: "USDC as Native Gas", desc: "Users pay gas in USDC — no volatile ETH needed. Predictable costs, aligns with merchandise pricing." },
              { title: "Sub-Second Finality", desc: "NFT mints confirm instantly. Marketplace trades settle under 1 second. Burns are irreversible and final." },
              { title: "EVM Compatible", desc: "Standard Solidity (ERC-721, ERC-2981). Works with Foundry, Hardhat, viem, ethers.js." },
              { title: "Native Compliance", desc: "Elliptic and TRM Labs integration. Transaction monitoring. Institutional-grade infrastructure." },
              { title: "Agentic Economy", desc: "ERC-8004 for AI agent identity. ERC-8183 for job settlement. Escrow pattern for fulfillment." },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-white/[0.06] p-5">
                <div className="text-[15px] font-medium text-white mb-2">{item.title}</div>
                <div className="text-[14px] text-white/40 leading-[1.6]">{item.desc}</div>
              </div>
            ))}
          </div>

          <h3 className="text-[20px] font-light text-white mt-10 mb-4">Why NOT Other Chains</h3>
          <Table
            headers={["Chain", "Problem"]}
            rows={[
              ["Chain", "Problem"],
              ["Ethereum", "High gas fees, slow finality"],
              ["Polygon", "No native USDC, bridge complexity"],
              ["Base", "ETH gas, not stablecoin-native"],
              ["Solana", "Different VM, no EVM tooling"],
              ["Arc ✅", "USDC native, sub-second, EVM, compliance"],
            ]}
          />
        </Section>

        <div className="h-px bg-white/[0.04] my-16" />

        {/* 05 — Architecture */}
        <Section id="architecture" n="05" title="System Architecture">
          <CodeBlock>{`┌──────────────────────────────────────────────────────────────┐
│                      ARCMERCH SYSTEM                         │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │  FRONTEND    │    │  BACKEND     │    │  BLOCKCHAIN  │   │
│  │  Next.js 14  │    │  Node.js API │    │  Arc Testnet │   │
│  │              │    │              │    │              │   │
│  │ • Gallery    │◄──►│ • Auth       │◄──►│ • NFT SC     │   │
│  │ • Creator    │    │ • AI Queue   │    │ • Marketplace│   │
│  │ • Profile    │    │ • Orders     │    │ • Registry   │   │
│  │ • Wallet     │    │ • IPFS       │    │ • Certificate│   │
│  └──────────────┘    └──────────────┘    └──────────────┘   │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐                       │
│  │  AI ENGINE   │    │  FULFILLMENT │                       │
│  │  DALL-E 3    │    │  Printful    │                       │
│  │  SDXL        │    │  API         │                       │
│  └──────────────┘    └──────────────┘                       │
└──────────────────────────────────────────────────────────────┘`}</CodeBlock>
        </Section>

        <div className="h-px bg-white/[0.04] my-16" />

        {/* 06 — Smart Contracts */}
        <Section id="contracts" n="06" title="Smart Contract Design">
          <h3 className="text-[20px] font-light text-white mt-4 mb-4">ArcMerchNFT (ERC-721)</h3>
          <p>The core NFT contract. Each token represents a merchandise design with metadata stored on IPFS.</p>
          <CodeBlock>{`contract ArcMerchNFT is ERC721, ERC721Royalty {
    enum ProductType { TSHIRT, HOODIE, CAP, MUG, POSTER }
    enum RedeemStatus { NONE, BURNED_FOR_HD, BURNED_FOR_PRINT }

    struct Design {
        uint256 tokenId;
        address creator;
        string metadataURI;        // IPFS CID
        string hdFileCID;          // Encrypted HD file
        ProductType productType;
        uint256 editionMax;
        uint256 priceUSDC;         // In USDC (6 decimals)
        uint256 timesBurned;
        RedeemStatus redeemStatus;
    }

    function mintDesign(...) external returns (uint256);
    function burnForHD(uint256 tokenId) external;
    function burnForPrint(uint256 tokenId, string memory addr) external;
}`}</CodeBlock>

          <h3 className="text-[20px] font-light text-white mt-8 mb-4">ArcMerchMarketplace</h3>
          <p>Handles listing, purchasing, and print order management.</p>

          <h3 className="text-[20px] font-light text-white mt-8 mb-4">CreatorRegistry</h3>
          <p>Links wallet addresses to X handles and tracks reputation.</p>

          <h3 className="text-[20px] font-light text-white mt-8 mb-4">BurnCertificate (Soulbound)</h3>
          <p>Non-transferable proof of burn — proves the holder was an original owner.</p>
        </Section>

        <div className="h-px bg-white/[0.04] my-16" />

        {/* 07 — Burn-to-Redeem */}
        <Section id="burn" n="07" title="Burn-to-Redeem Mechanic">
          <CodeBlock>{`                ┌─────────────────┐
                │   USER OWNS     │
                │   NFT ($50)     │
                └────────┬────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
     ┌─────────┐   ┌───────────┐   ┌──────────┐
     │  HOLD   │   │   BURN    │   │  ORDER   │
     │  NFT    │   │  → HD     │   │  PRINT   │
     │         │   │           │   │          │
     │ Trade   │   │ Get HD    │   │ ArcMerch │
     │ Collect │   │ 300dpi    │   │ prints & │
     │ Earn    │   │ PNG file  │   │ ships    │
     └─────────┘   └───────────┘   └──────────┘`}</CodeBlock>

          <h3 className="text-[20px] font-light text-white mt-8 mb-4">Deflationary Game Theory</h3>
          <p>Every burn permanently removes an NFT from circulation:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { label: "Launch", supply: "100", scarcity: "—" },
              { label: "20 burns", supply: "80", scarcity: "+25%" },
              { label: "50 burns", supply: "50", scarcity: "+100%" },
              { label: "80 burns", supply: "20", scarcity: "+400%" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-white/[0.06] p-4 text-center">
                <div className="text-[12px] text-white/30 mb-2">{s.label}</div>
                <div className="text-[24px] font-light text-white">{s.supply}</div>
                <div className="text-[12px] text-[#E9A13F] mt-1">{s.scarcity}</div>
              </div>
            ))}
          </div>
          <p className="mt-4">
            Early holders who don&apos;t burn benefit from increasing scarcity. The more people redeem physical products, the rarer the remaining digital collectibles become.
          </p>
        </Section>

        <div className="h-px bg-white/[0.04] my-16" />

        {/* 08 — Identity */}
        <Section id="identity" n="08" title="Creator Identity & X Verification">
          <Table
            headers={["Without Verification", "With Verification"]}
            rows={[
              ["Without Verification", "With Verification"],
              ['"Minted by 0x7f2a...3d8c"', '"Created by @arconomist ✓"'],
              ["Unknown = low trust", "Known creator = trusted"],
              ["No social proof", "Follower count = influence"],
              ["No free marketing", "Creators share on X → traffic"],
              ["Anonymous marketplace", "Community-driven platform"],
            ]}
          />
          <div className="mt-6 rounded-lg border border-[#1DA1F2]/10 bg-[#1DA1F2]/[0.03] p-5">
            <div className="text-[14px] font-medium text-[#1DA1F2] mb-2">X OAuth Flow</div>
            <ol className="list-decimal list-inside space-y-1 text-[14px] text-white/40">
              <li>User clicks &quot;Sign in with X&quot;</li>
              <li>Redirect to X OAuth 2.0 authorization</li>
              <li>ArcMerch receives @handle, verified status, avatar</li>
              <li>Wallet ↔ X handle linked</li>
              <li>Verified badge appears on profile + all NFTs</li>
            </ol>
          </div>
        </Section>

        <div className="h-px bg-white/[0.04] my-16" />

        {/* 09 — Reputation */}
        <Section id="reputation" n="09" title="Reputation System">
          <Table
            headers={["Badge", "Tier", "Score", "Requirements", "Perks"]}
            rows={[
              ["Badge", "Tier", "Score", "Requirements", "Perks"],
              ["🌱", "New", "0–99", "Wallet + X connected", "Basic access"],
              ["🌿", "Growing", "100–499", "10+ sales, 100+ followers", "Featured listing"],
              ["⭐", "Pro", "500–999", "50+ sales, 1K+ followers", "Lower fee (2%)"],
              ["🏆", "Elite", "1000+", "100+ sales, 10K+ followers", "Priority, collab, revenue share"],
            ]}
          />
          <CodeBlock>{`Score = (followers / 100) × 0.3
      + (total_sales × 10) × 0.3
      + (avg_rating × 20) × 0.2
      + (verified ? 100 : 0) × 0.2`}</CodeBlock>
        </Section>

        <div className="h-px bg-white/[0.04] my-16" />

        {/* 10 — AI Engine */}
        <Section id="ai-engine" n="10" title="AI Design Engine">
          <Table
            headers={["Model", "Strength", "Use Case"]}
            rows={[
              ["Model", "Strength", "Use Case"],
              ["DALL-E 3", "High quality, text rendering", "Complex illustrations"],
              ["SDXL", "Fast, customizable", "Bulk generation, style transfer"],
              ["Replicate", "Various specialized", "Niche styles, fine-tuned"],
            ]}
          />
          <CodeBlock>{`User Prompt: "neon cyberpunk samurai on black"
     │
     ▼
┌──────────────┐
│ Prompt       │  Enhance with style keywords
│ Enhancement  │  + product constraints
└──────┬───────┘
       ▼
┌──────────────┐
│ AI Generate  │  3 variants to choose
└──────┬───────┘
       ▼
┌──────────────┐
│ Background   │  Remove bg, optimize for print
│ Processing   │  CMYK-safe colors
└──────┬───────┘
       ▼
┌──────────────┐
│ IPFS Upload  │  Store design + metadata
│ + Mint       │  Mint NFT with CID
└──────────────┘`}</CodeBlock>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Resolution", value: "300 DPI min" },
              { label: "Format", value: "PNG transparent" },
              { label: "Size", value: "4500×5400px" },
              { label: "Bleed", value: '0.25" safe zone' },
            ].map((spec) => (
              <div key={spec.label} className="rounded-lg border border-white/[0.06] p-4 text-center">
                <div className="text-[11px] text-white/30 mb-1">{spec.label}</div>
                <div className="text-[14px] font-medium text-white">{spec.value}</div>
              </div>
            ))}
          </div>
        </Section>

        <div className="h-px bg-white/[0.04] my-16" />

        {/* 11 — Fulfillment */}
        <Section id="fulfillment" n="11" title="Print-on-Demand Fulfillment">
          <p>ArcMerch uses Printful as the fulfillment backend — no inventory needed.</p>
          <Table
            headers={["Product", "Base Cost", "Retail", "Margin"]}
            rows={[
              ["Product", "Base Cost", "Retail", "Margin"],
              ["T-Shirt", "$12.00", "$29.99", "$17.99"],
              ["Hoodie", "$22.00", "$49.99", "$27.99"],
              ["Cap", "$10.00", "$24.99", "$14.99"],
              ["Mug", "$8.00", "$19.99", "$11.99"],
              ["Poster", "$6.00", "$14.99", "$8.99"],
            ]}
          />
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { flag: "🇺🇸", region: "USA", detail: "Charlotte, Dallas" },
              { flag: "🇪🇺", region: "Europe", detail: "Riga, Barcelona" },
              { flag: "🇯🇵", region: "Japan", detail: "Partner facility" },
              { flag: "🇦🇺", region: "Australia", detail: "Partner facility" },
            ].map((loc) => (
              <div key={loc.region} className="rounded-lg border border-white/[0.06] p-4 text-center">
                <div className="text-[24px] mb-2">{loc.flag}</div>
                <div className="text-[14px] font-medium text-white">{loc.region}</div>
                <div className="text-[11px] text-white/30 mt-1">{loc.detail}</div>
              </div>
            ))}
          </div>
        </Section>

        <div className="h-px bg-white/[0.04] my-16" />

        {/* 12 — Revenue */}
        <Section id="revenue" n="12" title="Revenue Model & Tokenomics">
          <h3 className="text-[20px] font-light text-white mt-4 mb-4">NFT Sale ($50 USDC)</h3>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Creator", value: "$46.25", pct: "92.5%" },
              { label: "Platform", value: "$2.50", pct: "5%" },
              { label: "Treasury", value: "$1.25", pct: "2.5%" },
            ].map((r) => (
              <div key={r.label} className="rounded-lg border border-white/[0.06] p-5 text-center">
                <div className="text-[11px] text-white/30 mb-2">{r.label}</div>
                <div className="text-[22px] font-light text-white">{r.value}</div>
                <div className="text-[12px] text-[#E9A13F] mt-1">{r.pct}</div>
              </div>
            ))}
          </div>

          <h3 className="text-[20px] font-light text-white mt-8 mb-4">Treasury Allocation</h3>
          <Table
            headers={["Allocation", "%", "Purpose"]}
            rows={[
              ["Allocation", "%", "Purpose"],
              ["Development", "40%", "Engineering, infrastructure"],
              ["Creator Rewards", "25%", "Elite tier revenue share"],
              ["Marketing", "20%", "Community growth, partnerships"],
              ["Reserve", "15%", "Emergency fund, audits"],
            ]}
          />
        </Section>

        <div className="h-px bg-white/[0.04] my-16" />

        {/* 13 — Technical Stack */}
        <Section id="stack" n="13" title="Technical Stack">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {[
              { title: "Frontend", items: ["Next.js 14 (App Router)", "Arc App Kit", "wagmi 2.x + viem 2.x", "TailwindCSS 3.x"] },
              { title: "Backend", items: ["Node.js 20 LTS", "PostgreSQL 16", "Redis 7.x + Bull", "IPFS (Kubo 0.28)"] },
              { title: "Blockchain", items: ["Solidity 0.8.20", "Foundry + Hardhat", "OpenZeppelin 5.x", "USDC (native gas)"] },
              { title: "External Services", items: ["DALL-E 3 / SDXL", "Printful API", "X API v2 (OAuth)", "Pinata (IPFS pinning)"] },
            ].map((cat) => (
              <div key={cat.title} className="rounded-lg border border-white/[0.06] p-5">
                <div className="text-[14px] font-medium text-[#E9A13F] mb-3">{cat.title}</div>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li key={item} className="text-[13px] text-white/40 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-white/15" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <div className="h-px bg-white/[0.04] my-16" />

        {/* 14 — Security */}
        <Section id="security" n="14" title="Security Considerations">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {[
              { title: "Smart Contract", items: ["Third-party audit before mainnet", "OpenZeppelin battle-tested libs", "Reentrancy guards on all calls", "Role-based access control"] },
              { title: "Off-Chain", items: ["OAuth tokens never stored", "HD files encrypted on IPFS", "Shipping addresses encrypted", "API keys in env vars only"] },
              { title: "Economic", items: ["USDC/USD price oracle (future)", "AI gen capped at 10/hour", "Min mint price $5 USDC", "Max 1000 editions per design"] },
            ].map((cat) => (
              <div key={cat.title} className="rounded-lg border border-white/[0.06] p-5">
                <div className="text-[14px] font-medium text-white mb-3">{cat.title}</div>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li key={item} className="text-[13px] text-white/40 flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <div className="h-px bg-white/[0.04] my-16" />

        {/* 15 — Roadmap */}
        <Section id="roadmap" n="15" title="Roadmap">
          <div className="space-y-8 mt-6">
            {[
              { phase: "Phase 1", title: "MVP", time: "Week 1–2", items: ["Smart contracts (NFT + marketplace)", "Wallet connection on Arc testnet", "AI design generation", "NFT minting flow", "Gallery/marketplace UI"] },
              { phase: "Phase 2", title: "Identity & Burn", time: "Week 3–4", items: ["X OAuth verification", "Creator profiles + registry", "Burn-to-redeem (HD + Print)", "Soulbound burn certificates", "Reputation system v1"] },
              { phase: "Phase 3", title: "Launch", time: "Week 5–6", items: ["Printful API integration", "Testnet beta launch", "Arc grant submission", "Community onboarding (10 creators)", "First physical product tests"] },
              { phase: "Phase 4", title: "Scale", time: "Week 7–12", items: ["Mainnet deployment", "Mobile-responsive UI", "100+ creators onboarded", "Secondary marketplace features", "Analytics dashboard"] },
              { phase: "Phase 5", title: "Growth", time: "Month 4–6", items: ["Mobile app (React Native)", "Custom AI model fine-tuning", "Brand collaboration program", "Multi-chain bridge (future)", "DAO governance for treasury"] },
            ].map((p) => (
              <div key={p.phase} className="rounded-lg border border-white/[0.06] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[12px] font-mono text-[#E9A13F]/60">{p.phase}</span>
                  <span className="text-[18px] font-light text-white">{p.title}</span>
                  <span className="text-[12px] text-white/20 ml-auto">{p.time}</span>
                </div>
                <ul className="grid grid-cols-2 gap-2">
                  {p.items.map((item) => (
                    <li key={item} className="text-[13px] text-white/40 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-white/15" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <div className="h-px bg-white/[0.04] my-16" />

        {/* 16 — Grant Alignment */}
        <Section id="grant" n="16" title="Grant Alignment with Arc">
          <div className="space-y-4 mt-6">
            {[
              { title: "USDC as Native Gas", desc: "Every transaction — minting, buying, burning, ordering — uses USDC. Real commerce, not just DeFi speculation." },
              { title: "Agentic Economy", desc: "AI agents as first-class participants: Design Agent (ERC-8004), Fulfillment Agent (ERC-8183), Curation Agent (future)." },
              { title: "Real-World Commerce", desc: "Digital creation → Physical product. On-chain ownership → Doorstep delivery. USDC payment → Global shipping." },
              { title: "Creator Economy on Arc", desc: "Creators earn USDC directly. Royalty enforcement on-chain. Reputation incentivizes quality. X verification = social proof." },
              { title: "Technical Innovation", desc: "Burn-to-redeem (novel NFT lifecycle), soulbound certificates, deflationary game theory, AI + blockchain pipeline." },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-[#E9A13F]/10 bg-[#E9A13F]/[0.02] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-[15px] font-medium text-white">{item.title}</span>
                </div>
                <p className="text-[14px] text-white/40 leading-[1.6]">{item.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <div className="h-px bg-white/[0.04] my-16" />

        {/* 17 — Team */}
        <Section id="team" n="17" title="Team">
          <div className="rounded-lg border border-white/[0.06] p-6 mt-6">
            <div className="text-[20px] font-light text-white mb-2">Muhammad Iqbal</div>
            <div className="text-[14px] text-white/40 mb-4">Founder & Sole Developer</div>
            <a
              href="https://x.com/arconomist"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[14px] text-[#E9A13F] hover:underline"
            >
              @arconomist <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </Section>

        {/* Footer CTA */}
        <div className="mt-20 mb-10 rounded-xl border border-[#E9A13F]/10 bg-[#E9A13F]/[0.03] p-10 text-center">
          <div className="text-[28px] font-light text-white mb-3">Ready to build on Arc</div>
          <p className="text-[15px] text-white/40 mb-6 max-w-[400px] mx-auto">
            ArcMerch bridges AI creativity, NFT ownership, and real-world commerce — all on Arc&apos;s stablecoin-native infrastructure.
          </p>
          <div className="flex gap-3 justify-center">
            <a href="/" className="btn-primary">Launch App</a>
            <a href="https://x.com/arconomist" target="_blank" rel="noopener noreferrer" className="btn-outline">
              Follow @arconomist
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
