"use client";

import { useState, useRef } from "react";
import { Sparkles, ArrowRight, Loader2, Check, Upload, Image as ImageIcon, X } from "lucide-react";
import { useAuth } from "@/lib/auth-provider";
import { VerifiedBadge } from "@/components/verified-badge";

const PRODUCTS = [
  { id: "tshirt", name: "T-Shirt", emoji: "👕", price: "$29.99" },
  { id: "hoodie", name: "Hoodie", emoji: "🧥", price: "$49.99" },
  { id: "cap", name: "Cap", emoji: "🧢", price: "$24.99" },
  { id: "mug", name: "Mug", emoji: "☕", price: "$19.99" },
  { id: "poster", name: "Poster", emoji: "🖼️", price: "$14.99" },
];

const STYLES = ["Realistic", "Anime", "Pixel Art", "Watercolor", "Cyberpunk", "Minimalist", "Graffiti", "3D Render"];

type DesignMode = "ai" | "upload";

export default function CreatePage() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<DesignMode>("ai");
  const [prompt, setPrompt] = useState("");
  const [product, setProduct] = useState("tshirt");
  const [style, setStyle] = useState("");
  const [edition, setEdition] = useState("10");
  const [price, setPrice] = useState("25");
  const [generating, setGenerating] = useState(false);

  // Upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [designTitle, setDesignTitle] = useState("");

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setStep(2); }, 2000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload PNG, JPG, WebP, or SVG");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Max file size: 10MB");
      return;
    }

    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setUploadedPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeUpload = () => {
    setUploadedFile(null);
    setUploadedPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const canProceed = mode === "ai" ? prompt.trim() : uploadedFile;

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="mx-auto max-w-[720px] px-6 lg:px-10 py-16">
        {/* Header */}
        <div className="section-label mb-3">{"{ CREATE }"}</div>
        <h1 className="text-[40px] md:text-[56px] font-light tracking-[-0.02em] text-white mb-3">
          Create design
        </h1>
        <p className="text-[16px] text-white/40 mb-12">
          Generate with AI or upload your own design, then mint as NFT
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
            {/* Mode Toggle */}
            <div className="flex gap-3">
              <button
                onClick={() => setMode("ai")}
                className={`flex-1 flex items-center justify-center gap-3 rounded-xl border p-5 transition-all duration-150 ${
                  mode === "ai" ? "border-[#E9A13F] bg-[#E9A13F]/5" : "border-white/10 hover:border-white/20"
                }`}
              >
                <Sparkles className={`w-5 h-5 ${mode === "ai" ? "text-[#E9A13F]" : "text-white/40"}`} />
                <div className="text-left">
                  <div className={`text-[15px] font-medium ${mode === "ai" ? "text-white" : "text-white/60"}`}>
                    Generate with AI
                  </div>
                  <div className="text-[12px] text-white/30">Describe your vision</div>
                </div>
              </button>
              <button
                onClick={() => setMode("upload")}
                className={`flex-1 flex items-center justify-center gap-3 rounded-xl border p-5 transition-all duration-150 ${
                  mode === "upload" ? "border-[#E9A13F] bg-[#E9A13F]/5" : "border-white/10 hover:border-white/20"
                }`}
              >
                <Upload className={`w-5 h-5 ${mode === "upload" ? "text-[#E9A13F]" : "text-white/40"}`} />
                <div className="text-left">
                  <div className={`text-[15px] font-medium ${mode === "upload" ? "text-white" : "text-white/60"}`}>
                    Upload Design
                  </div>
                  <div className="text-[12px] text-white/30">Your own artwork</div>
                </div>
              </button>
            </div>

            {/* AI Mode */}
            {mode === "ai" && (
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
            )}

            {/* Upload Mode */}
            {mode === "upload" && (
              <div>
                <label className="text-[13px] text-white/40 mb-3 block">Upload your design</label>

                {!uploadedPreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-xl border-2 border-dashed border-white/10 hover:border-white/20 p-10 text-center cursor-pointer transition-colors"
                  >
                    <ImageIcon className="w-10 h-10 text-white/15 mx-auto mb-4" />
                    <div className="text-[15px] text-white/40 mb-2">
                      Click to upload or drag and drop
                    </div>
                    <div className="text-[12px] text-white/20">
                      PNG, JPG, WebP, SVG — max 10MB
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-xl border border-white/10 p-4">
                    <button
                      onClick={removeUpload}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors z-10"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                        <img src={uploadedPreview} alt="Upload preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] text-white truncate">{uploadedFile?.name}</div>
                        <div className="text-[12px] text-white/30 mt-1">
                          {uploadedFile ? (uploadedFile.size / 1024 / 1024).toFixed(2) : 0} MB
                        </div>
                        <div className="text-[12px] text-green-400 mt-1 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Ready to mint
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Design title for uploads */}
                {uploadedFile && (
                  <div className="mt-4">
                    <label className="text-[13px] text-white/40 mb-3 block">Design title</label>
                    <input
                      type="text"
                      value={designTitle}
                      onChange={(e) => setDesignTitle(e.target.value)}
                      placeholder="e.g., Cosmic Dragon Tee"
                      className="w-full rounded-lg border border-white/10 bg-transparent p-3 text-[15px] text-white placeholder:text-white/20 focus:border-white/25 focus:outline-none transition-colors"
                    />
                  </div>
                )}

                {/* Verified creator note */}
                {user?.verified && (
                  <div className="mt-4 flex items-center gap-2 bg-[#1DA1F2]/5 border border-[#1DA1F2]/10 rounded-lg px-4 py-3">
                    <VerifiedBadge size="md" />
                    <span className="text-[13px] text-[#1DA1F2]/80">
                      Verified creator — your X-verified designs get priority listing
                    </span>
                  </div>
                )}
              </div>
            )}

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

            {/* Generate / Continue */}
            {mode === "ai" ? (
              <button onClick={handleGenerate} disabled={!prompt || generating}
                className="w-full btn-primary justify-center py-4 text-[16px] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {generating ? <><Loader2 className="h-4 w-4 animate-spin" />Generating...</> : <><Sparkles className="h-4 w-4" />Generate with AI</>}
              </button>
            ) : (
              <button onClick={() => setStep(2)} disabled={!uploadedFile}
                className="w-full btn-primary justify-center py-4 text-[16px] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Step 2: Preview */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Preview */}
              <div className="rounded-xl border border-white/10 p-6">
                {mode === "upload" && uploadedPreview ? (
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <img src={uploadedPreview} alt="Design preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                    <span className="text-[80px]">⚔️</span>
                  </div>
                )}
                <p className="text-[11px] text-white/20 text-center mt-3">
                  {mode === "upload" ? "Your uploaded design" : "Mock preview — actual AI generates unique designs"}
                </p>
              </div>

              {/* Details */}
              <div className="space-y-4">
                {mode === "ai" ? (
                  <div className="rounded-lg border border-white/10 p-4">
                    <div className="text-[11px] text-white/30 mb-1">Prompt</div>
                    <div className="text-[14px] text-white">{prompt || "Neon cyberpunk samurai"}</div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-white/10 p-4">
                    <div className="text-[11px] text-white/30 mb-1">Design</div>
                    <div className="text-[14px] text-white">{designTitle || uploadedFile?.name || "Custom upload"}</div>
                    <div className="text-[12px] text-white/20 mt-1 flex items-center gap-1">
                      <Upload className="w-3 h-3" /> Original artwork
                      {user?.verified && <><span className="mx-1">·</span><VerifiedBadge size="sm" showLabel /></>}
                    </div>
                  </div>
                )}
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
                {mode === "upload"
                  ? "Your original design will be minted as ERC-721 on Arc. Ownership permanently on-chain."
                  : "Your AI design will be minted as ERC-721 on Arc. Gas paid in USDC."
                }
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
                <button className="flex-1 btn-primary justify-center">
                  🔥 {mode === "upload" ? "Mint Original" : "Mint NFT"}
                </button>
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
