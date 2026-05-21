"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, Loader2, Check } from "lucide-react";

const PRODUCTS = [
  { id: "tshirt", name: "T-Shirt", emoji: "👕", price: "$29.99" },
  { id: "hoodie", name: "Hoodie", emoji: "🧥", price: "$49.99" },
  { id: "cap", name: "Cap", emoji: "🧢", price: "$24.99" },
  { id: "mug", name: "Mug", emoji: "☕", price: "$19.99" },
  { id: "poster", name: "Poster", emoji: "🖼️", price: "$14.99" },
];

const STYLES = ["Realistic", "Anime", "Pixel Art", "Watercolor", "Cyberpunk", "Minimalist", "Graffiti", "3D Render"];

export default function CreatePage() {
  const [step, setStep] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [product, setProduct] = useState("tshirt");
  const [style, setStyle] = useState("");
  const [edition, setEdition] = useState("10");
  const [price, setPrice] = useState("25");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setStep(2); }, 2000);
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="mx-auto max-w-[720px] px-6 lg:px-10 py-16">
        {/* Header */}
        <div className="section-label mb-3">{"{ CREATE }"}</div>
        <h1 className="text-[40px] md:text-[56px] font-light tracking-[-0.02em] text-white mb-3">
          Create design
        </h1>
        <p className="text-[16px] text-white/40 mb-12">
          Describe your vision, AI generates it, mint as NFT
        </p>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-12">
          {[
            { n: 1, label: "Design" },
            { n: 2, label: "Preview" },
            { n: 3, label: "Mint" },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-3">
              <div className={`flex items-center gap-2 ${step >= s.n ? "text-white" : "text-white/20"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-medium ${
                  step > s.n ? "bg-amber text-black" : step === s.n ? "border border-white/40 text-white" : "border border-white/10 text-white/20"
                }`}>
                  {step > s.n ? <Check className="h-3 w-3" /> : s.n}
                </div>
                <span className="text-[13px]">{s.label}</span>
              </div>
              {i < 2 && <div className={`w-8 h-px ${step > s.n ? "bg-amber" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Design */}
        {step === 1 && (
          <div className="space-y-8">
            {/* Prompt */}
            <div>
              <label className="text-[13px] text-white/40 mb-3 block">Design prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Neon cyberpunk samurai with glowing katana on dark background"
                rows={4}
                className="w-full rounded-lg border border-white/10 bg-transparent p-4 text-[15px] text-white placeholder:text-white/20 focus:border-white/25 focus:outline-none resize-none transition-colors"
              />

              {/* Style presets */}
              <div className="flex flex-wrap gap-2 mt-4">
                {STYLES.map((s) => (
                  <button key={s} onClick={() => setStyle(style === s ? "" : s)}
                    className={`rounded-md px-3 py-1.5 text-[12px] transition-all duration-150 ${
                      style === s ? "bg-amber text-black" : "border border-white/10 text-white/40 hover:border-white/20"
                    }`}
                  >{s}</button>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <label className="text-[13px] text-white/40 mb-3 block">Product type</label>
              <div className="grid grid-cols-5 gap-3">
                {PRODUCTS.map((p) => (
                  <button key={p.id} onClick={() => setProduct(p.id)}
                    className={`rounded-lg border p-4 text-center transition-all duration-150 ${
                      product === p.id ? "border-amber bg-amber/5" : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="text-[28px] mb-2">{p.emoji}</div>
                    <div className="text-[12px] font-medium text-white">{p.name}</div>
                    <div className="text-[11px] text-white/30 mt-0.5">{p.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Edition + Price */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[13px] text-white/40 mb-3 block">Edition size</label>
                <input type="number" value={edition} onChange={(e) => setEdition(e.target.value)} min="1" max="1000"
                  className="w-full rounded-lg border border-white/10 bg-transparent p-3 text-[15px] text-white focus:border-white/25 focus:outline-none transition-colors"
                />
                <p className="text-[11px] text-white/20 mt-2">Max 1000 per design</p>
              </div>
              <div>
                <label className="text-[13px] text-white/40 mb-3 block">Price (USDC)</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} min="5"
                  className="w-full rounded-lg border border-white/10 bg-transparent p-3 text-[15px] text-white focus:border-white/25 focus:outline-none transition-colors"
                />
                <p className="text-[11px] text-white/20 mt-2">Minimum 5 USDC</p>
              </div>
            </div>

            {/* Generate */}
            <button onClick={handleGenerate} disabled={!prompt || generating}
              className="w-full btn-primary justify-center py-4 text-[16px] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {generating ? <><Loader2 className="h-4 w-4 animate-spin" />Generating...</> : <><Sparkles className="h-4 w-4" />Generate with AI</>}
            </button>
          </div>
        )}

        {/* Step 2: Preview */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Preview */}
              <div className="rounded-xl border border-white/10 p-6">
                <div className="aspect-square rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                  <span className="text-[80px]">⚔️</span>
                </div>
                <p className="text-[11px] text-white/20 text-center mt-3">Mock preview — actual AI generates unique designs</p>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="rounded-lg border border-white/10 p-4">
                  <div className="text-[11px] text-white/30 mb-1">Prompt</div>
                  <div className="text-[14px] text-white">{prompt || "Neon cyberpunk samurai"}</div>
                </div>
                <div className="rounded-lg border border-white/10 p-4">
                  <div className="text-[11px] text-white/30 mb-1">Product</div>
                  <div className="text-[14px] text-white">{PRODUCTS.find(p => p.id === product)?.emoji} {PRODUCTS.find(p => p.id === product)?.name}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-white/10 p-4">
                    <div className="text-[11px] text-white/30 mb-1">Edition</div>
                    <div className="text-[20px] font-light text-white">{edition}</div>
                  </div>
                  <div className="rounded-lg border border-white/10 p-4">
                    <div className="text-[11px] text-white/30 mb-1">Price</div>
                    <div className="text-[20px] font-light text-amber">{price} USDC</div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep(1)} className="flex-1 btn-outline justify-center">Back</button>
                  <button onClick={() => setStep(3)} className="flex-1 btn-primary justify-center">
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Mint */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="rounded-xl border border-white/10 p-10 text-center">
              <div className="text-[48px] mb-6">🖼️</div>
              <h2 className="text-[28px] font-light text-white mb-2">Ready to mint</h2>
              <p className="text-[14px] text-white/40 mb-10 max-w-[380px] mx-auto">
                Your design will be minted as ERC-721 on Arc. Gas paid in USDC.
              </p>

              <div className="mx-auto max-w-[320px] space-y-3 mb-10">
                {[
                  { label: "NFT Price", value: `${price} USDC` },
                  { label: "Gas (est.)", value: "~0.05 USDC" },
                  { label: "Platform (2.5%)", value: `${(Number(price) * 0.025).toFixed(2)} USDC` },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between py-3 border-b border-white/[0.06]">
                    <span className="text-[13px] text-white/40">{row.label}</span>
                    <span className="mono text-[13px] text-white">{row.value}</span>
                  </div>
                ))}
                <div className="flex justify-between py-3">
                  <span className="text-[14px] font-medium text-white">You receive</span>
                  <span className="mono text-[14px] text-amber">{(Number(price) * 0.975).toFixed(2)} USDC/sale</span>
                </div>
              </div>

              <div className="flex gap-3 max-w-[320px] mx-auto">
                <button onClick={() => setStep(2)} className="flex-1 btn-outline justify-center">Back</button>
                <button className="flex-1 btn-primary justify-center">🔥 Mint NFT</button>
              </div>
            </div>

            <p className="text-[11px] text-white/20 text-center">
              By minting you agree to ArcMerch terms. NFTs minted on Arc Testnet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
