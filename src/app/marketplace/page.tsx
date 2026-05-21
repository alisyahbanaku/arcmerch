"use client";

import { useState } from "react";
import { Search, Flame, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

const ALL_DESIGNS = [
  { id: 1, title: "Neon Samurai", creator: "@arconomist", price: "25", edition: "1/10", product: "T-Shirt", burned: 3, color: "#9F72FF", emoji: "⚔️", verified: true },
  { id: 2, title: "Arc Galaxy", creator: "@builder0x", price: "30", edition: "1/50", product: "Hoodie", burned: 12, color: "#2F578C", emoji: "🌌", verified: true },
  { id: 3, title: "USDC Waves", creator: "@stabledev", price: "15", edition: "1/100", product: "Cap", burned: 45, color: "#2A9D8F", emoji: "🌊", verified: false },
  { id: 4, title: "Cyber Punk Cat", creator: "@nekoartist", price: "20", edition: "1/25", product: "T-Shirt", burned: 8, color: "#E9A13F", emoji: "🐱", verified: true },
  { id: 5, title: "Blockchain City", creator: "@web3painter", price: "50", edition: "1/10", product: "Poster", burned: 2, color: "#E76F51", emoji: "🏙️", verified: false },
  { id: 6, title: "DeFi Dreams", creator: "@cryptomind", price: "35", edition: "1/20", product: "Hoodie", burned: 7, color: "#7B68EE", emoji: "💭", verified: true },
  { id: 7, title: "Moon Phase", creator: "@lunartist", price: "18", edition: "1/50", product: "Mug", burned: 15, color: "#6B7280", emoji: "🌙", verified: false },
  { id: 8, title: "Crypto Tiger", creator: "@nftbeast", price: "45", edition: "1/5", product: "Hoodie", burned: 1, color: "#F59E0B", emoji: "🐯", verified: true },
  { id: 9, title: "Stablecoin Rose", creator: "@floraldefi", price: "22", edition: "1/30", product: "T-Shirt", burned: 10, color: "#E11D48", emoji: "🌹", verified: false },
];

const FILTERS = ["All", "T-Shirt", "Hoodie", "Cap", "Mug", "Poster"];
const SORT = ["Recent", "Price: Low", "Price: High", "Most Burned"];

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Recent");

  const filtered = ALL_DESIGNS.filter((d) => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.creator.toLowerCase().includes(search.toLowerCase());
    const matchProduct = activeFilter === "All" || d.product === activeFilter;
    return matchSearch && matchProduct;
  });

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-16">
        {/* Header */}
        <div className="section-label mb-3">{"{ MARKETPLACE }"}</div>
        <h1 className="text-[40px] md:text-[56px] font-light tracking-[-0.02em] text-white mb-3">
          Explore designs
        </h1>
        <p className="text-[16px] text-white/40 mb-12">
          Browse AI-generated merchandise NFTs on Arc blockchain
        </p>

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-[400px] flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
            <input
              type="text"
              placeholder="Search designs or creators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-transparent py-3 pl-11 pr-4 text-[14px] text-white placeholder:text-white/25 focus:border-white/25 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            <SlidersHorizontal className="h-4 w-4 text-white/25" />
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
        <div className="text-[13px] text-white/30 mb-8">
          {filtered.length} designs
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <div key={d.id} className="group cursor-pointer">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden flex items-center justify-center" style={{ backgroundColor: d.color }}>
                <span className="text-[64px]">{d.emoji}</span>
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="mono text-[11px] bg-black/40 backdrop-blur-sm text-white px-2 py-1 rounded-md">{d.edition}</span>
                  <span className="text-[11px] bg-black/40 backdrop-blur-sm text-white px-2 py-1 rounded-md">{d.product}</span>
                </div>
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
                  </div>
                  <span className="mono text-[15px] font-medium text-white">{d.price} USDC</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 rounded-lg bg-amber text-black py-2 text-[13px] font-medium hover:bg-amber/80 transition-colors">
                    Buy NFT
                  </button>
                  <button className="rounded-lg border border-white/10 py-2 px-3 text-[13px] text-white/40 hover:border-red-500/30 hover:text-red-400 transition-colors">
                    <Flame className="h-3.5 w-3.5" />
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
