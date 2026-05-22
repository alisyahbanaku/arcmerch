"use client";

import { useState, useEffect } from "react";
import { Search, Flame, SlidersHorizontal, ExternalLink, Loader2, Zap, Globe, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";
import { useActiveWallet } from "@/lib/wallet-context";
import { useTotalMinted, useMaxSupply, useMintPrice, useBurnNFT } from "@/hooks/useArcMerch";
import { useUnifiedBalance } from "@/hooks/useAppKit";

// Featured collection: Arc ecosystem logo merch (with product mockups)
const FEATURED_DESIGNS = [
  { id: 101, title: "Arc Logo Tee", creator: "@arcmerch", price: "25", edition: "1/100", product: "T-Shirt", burned: 0, image: "/mockups/arc-tee-mockup.jpg", bgColor: "#0A0A0A", badge: "OFFICIAL", verified: true, description: "The Arc blockchain logo on premium black tee. Minimalist arch mark." },
  { id: 102, title: "Arc Cap", creator: "@arcmerch", price: "20", edition: "1/50", product: "Cap", burned: 0, image: "/mockups/arc-cap-mockup.jpg", bgColor: "#0A0A0A", badge: "OFFICIAL", verified: true, description: "Arc blockchain logo on premium black cap. Clean minimal design." },
];

const ALL_DESIGNS = [
  ...FEATURED_DESIGNS,
];

const FILTERS = ["All", "T-Shirt", "Hoodie", "Cap", "Sticker", "Poster"];
const SORT = ["Recent", "Price: Low", "Price: High", "Most Burned"];

export default function MarketplacePage() {
  const { authenticated, login } = usePrivy();
  const { activeWallet } = useActiveWallet();
  const address = activeWallet?.address || "";
  const isConnected = authenticated && !!address;
  const totalMinted = useTotalMinted();
  const maxSupply = useMaxSupply();
  const mintPrice = useMintPrice();
  const { burn, isPending: isBurning, hash: burnHash } = useBurnNFT();
  const { totalUnified, fetchBalances } = useUnifiedBalance();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Recent");
  const [burningId, setBurningId] = useState<number | null>(null);

  useEffect(() => {
    if (address) fetchBalances(address);
  }, [address, fetchBalances]);

  const filtered = ALL_DESIGNS.filter((d) => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.creator.toLowerCase().includes(search.toLowerCase());
    const matchProduct = activeFilter === "All" || d.product === activeFilter;
    return matchSearch && matchProduct;
  });

  const handleBurn = (id: number) => {
    if (!isConnected) {
      login();
      return;
    }
    setBurningId(id);
    burn(id);
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Ambient glow — matches homepage */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(233,161,63,0.04)_0%,transparent_50%)] pointer-events-none" />

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
        {/* Header */}
        <div className="section-label mb-3">{"{ MARKETPLACE }"}</div>
        <h1 className="text-[28px] sm:text-[36px] md:text-[56px] font-light tracking-[-0.02em] text-white mb-3">
          Explore designs
        </h1>
        <p className="text-[16px] text-white/40 mb-8">
          Browse AI-generated merchandise NFTs on Arc blockchain
        </p>

        {/* Live Contract Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <div className="text-[11px] text-white/45 mb-1">Total Minted</div>
            <div className="text-[20px] font-light text-white mono">
              {totalMinted.data?.toString() || "0"}
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <div className="text-[11px] text-white/45 mb-1">Max Supply</div>
            <div className="text-[20px] font-light text-white mono">
              {maxSupply.data?.toString() || "10,000"}
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <div className="text-[11px] text-white/45 mb-1">Mint Price</div>
            <div className="text-[20px] font-light text-[#E9A13F] mono">
              {mintPrice.priceFormatted} USDC
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <div className="text-[11px] text-white/45 mb-1">Contract</div>
            <a
              href="https://testnet.arcscan.app/address/0x27881c74CF4Db0B361Bc67647046583C6e0f2162"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-[#E9A13F] hover:underline flex items-center gap-1"
            >
              0x2788...f2162 <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Unified Balance Banner */}
        {isConnected && parseFloat(totalUnified) > 0 && (
          <div className="rounded-xl border border-[#E9A13F]/20 bg-[#E9A13F]/5 p-4 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-[#E9A13F]" />
              <div>
                <span className="text-[14px] font-medium text-white">
                  {totalUnified} USDC unified balance
                </span>
                <span className="text-[12px] text-white/40 ml-2">
                  across chains
                </span>
              </div>
            </div>
            <Link
              href="/bridge"
              className="text-[13px] text-[#E9A13F] hover:underline flex items-center gap-1"
            >
              <Globe className="w-3 h-3" /> Bridge to Arc
            </Link>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-[400px] flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search designs or creators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-transparent py-3 pl-11 pr-4 text-[14px] text-white placeholder:text-white/40 focus:border-white/25 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            <SlidersHorizontal className="h-4 w-4 text-white/40" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-white/10 bg-transparent py-2.5 px-3 text-[13px] text-white focus:border-white/25 focus:outline-none"
            >
              {SORT.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>

        {/* Product filter pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`rounded-lg px-4 py-2 text-[13px] font-medium transition-all duration-150 ${
                activeFilter === f
                  ? "bg-amber text-black"
                  : "border border-white/10 text-white/50 hover:border-white/20 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Count */}
        <div className="text-[13px] text-white/45 mb-8">
          {filtered.length} designs
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <div key={d.id} className="group cursor-pointer">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden flex items-center justify-center" style={{ backgroundColor: d.bgColor }}>
                {d.image ? (
                  <img
                    src={d.image}
                    alt={d.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[64px]">{"emoji" in d ? (d as { emoji: string }).emoji : "🎨"}</span>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="mono text-[11px] bg-black/40 backdrop-blur-sm text-white px-2 py-1 rounded-md">{d.edition}</span>
                  <span className="text-[11px] bg-black/40 backdrop-blur-sm text-white px-2 py-1 rounded-md">{d.product}</span>
                </div>
                {d.badge && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#E9A13F] text-black px-2 py-1 rounded-md text-[10px] font-bold">
                    <Star className="h-2.5 w-2.5" />{d.badge}
                  </div>
                )}
                {d.burned > 0 && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white px-2 py-1 rounded-md text-[11px]">
                    <Flame className="h-3 w-3" />{d.burned}
                  </div>
                )}
              </div>
              <div className="mt-4 px-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[16px] font-medium text-white group-hover:text-amber transition-colors duration-150">{d.title}</h3>
                    <p className="text-[13px] text-white/40 mt-0.5">
                      {d.creator}{d.verified && <span className="ml-1 text-blue-400">✓</span>}
                    </p>
                    {d.description && (
                      <p className="text-[12px] text-white/30 mt-1 line-clamp-1">{d.description}</p>
                    )}
                  </div>
                  <span className="mono text-[15px] font-medium text-white">{d.price} USDC</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 rounded-lg bg-amber text-black py-2 text-[13px] font-medium hover:bg-amber/80 transition-colors">
                    Buy NFT
                  </button>
                  <button
                    onClick={() => handleBurn(d.id)}
                    disabled={isBurning && burningId === d.id}
                    className="rounded-lg border border-white/10 py-2 px-3 text-[13px] text-white/40 hover:border-red-500/30 hover:text-red-400 transition-colors disabled:opacity-50"
                  >
                    {isBurning && burningId === d.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Flame className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-[48px] mb-4">🔍</div>
            <div className="text-[18px] text-white/40">No designs found</div>
            <p className="text-[14px] text-white/35 mt-2">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Note about mock data */}
        <div className="mt-12 rounded-lg border border-white/5 bg-white/[0.01] p-6 text-center">
          <p className="text-[13px] text-white/35">
            Marketplace display uses sample data. On-chain minting is live — create your own NFTs via the{" "}
            <Link href="/create" className="text-[#E9A13F] hover:underline">Create</Link> page.
          </p>
        </div>
      </div>
    </div>
  );
}
