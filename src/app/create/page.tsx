"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, ArrowRight, Loader2, Check, Upload, Image as ImageIcon, X, Wallet, ExternalLink, Zap, Globe } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { useActiveWallet } from "@/lib/wallet-context";
import { formatUnits } from "viem";
import { useMintNFT, useApproveUSDC, useUSDCBalance, useUSDCAllowance, useMintPrice } from "@/hooks/useArcMerch";
import { useUnifiedBalance } from "@/hooks/useAppKit";
import { ARC_MERCH_NFT_ADDRESS } from "@/lib/contracts";
import Link from "next/link";

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
  const { authenticated, login } = usePrivy();
  const { activeWallet } = useActiveWallet();
  const address = activeWallet?.address || "";
  const isConnected = authenticated && !!address;
  const { priceRaw, priceFormatted } = useMintPrice();
  const usdcBalance = useUSDCBalance(address);
  const usdcAllowance = useUSDCAllowance(address);
  const { mint, isPending: isMinting, isConfirming, isSuccess, hash, error: mintError } = useMintNFT();
  const { approve, isPending: isApproving, isConfirming: isApproveConfirming, isSuccess: isApproveSuccess, hash: approveHash } = useApproveUSDC();
  const { totalUnified, fetchBalances } = useUnifiedBalance();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<DesignMode>("ai");
  const [prompt, setPrompt] = useState("");
  const [product, setProduct] = useState("tshirt");
  const [style, setStyle] = useState("");
  const [edition, setEdition] = useState("10");
  const [generating, setGenerating] = useState(false);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateSeed, setGenerateSeed] = useState<number>(Math.floor(Math.random() * 100000));

  // Upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [designTitle, setDesignTitle] = useState("");
  const [metadataUri, setMetadataUri] = useState("");

  // Check if USDC approval is needed
  const needsApproval = priceRaw && usdcAllowance.data !== undefined
    ? usdcAllowance.data < priceRaw
    : true;

  // After approve success, check if we should auto-mint
  useEffect(() => {
    if (isApproveSuccess && step === 3) {
      // Re-check allowance after approval
    }
  }, [isApproveSuccess, step]);

  // Fetch unified balance when wallet connects
  useEffect(() => {
    if (address) fetchBalances(address);
  }, [address, fetchBalances]);

  const handleGenerate = async (regenerate = false) => {
    if (!prompt.trim()) return;
    
    const seed = regenerate ? Math.floor(Math.random() * 100000) : generateSeed;
    setGenerateSeed(seed);
    setGenerating(true);
    setGenerateError(null);
    setGenerateProgress(0);

    // Simulate progress while generating
    const progressInterval = setInterval(() => {
      setGenerateProgress((prev) => Math.min(prev + Math.random() * 15, 90));
    }, 500);

    try {
      const params = new URLSearchParams({
        prompt: prompt.trim(),
        style: style,
        product: product,
        width: "512",
        height: "512",
        seed: String(seed),
      });

      const response = await fetch(`/api/generate?${params}`);
      
      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Generation failed" }));
        throw new Error(err.error || "Failed to generate image");
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      
      setGeneratedImageUrl(imageUrl);
      setGenerateProgress(100);
      setMetadataUri(`ipfs://QmArcMerch/${Date.now()}`);
      setStep(2);
    } catch (err: any) {
      setGenerateError(err.message || "Generation failed. Try again.");
      console.error("AI generation error:", err);
    } finally {
      clearInterval(progressInterval);
      setGenerating(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
    reader.onload = (ev) => setUploadedPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeUpload = () => {
    setUploadedFile(null);
    setUploadedPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleApprove = () => {
    approve(priceRaw);
  };

  const handleMint = () => {
    if (!address || !priceRaw) return;

    // In production, this would upload to IPFS first
    const uri = metadataUri || `ipfs://QmArcMerch/${Date.now()}`;

    mint({
      uri,
      productType: product,
      designTitle: designTitle || prompt.slice(0, 50),
      maxEditions: parseInt(edition) || 10,
      to: address,
    });
  };

  const canProceed = mode === "ai" ? prompt.trim() : uploadedFile;

  // Format balances
  const usdcBalFormatted = usdcBalance.data ? formatUnits(usdcBalance.data, 6) : "0";
  const hasEnoughUSDC = priceRaw ? (usdcBalance.data || BigInt(0)) >= priceRaw : false;

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Ambient glow — matches homepage hero */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(233,161,63,0.04)_0%,transparent_50%)] pointer-events-none" />

      <div className="relative mx-auto max-w-[720px] px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
        {/* Header */}
        <div className="section-label mb-3">{"{ CREATE }"}</div>
        <h1 className="text-[28px] sm:text-[36px] md:text-[56px] font-light tracking-[-0.02em] text-white mb-3">
          Create design
        </h1>
        <p className="text-[16px] text-white/70 mb-12">
          Generate with AI or upload your own design, then mint as NFT
        </p>

        {/* Wallet Status */}
        {!isConnected && (
          <div className="rounded-xl border border-[#E9A13F]/20 bg-[#E9A13F]/5 p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Wallet className="w-5 h-5 text-[#E9A13F]" />
              <span className="text-[15px] font-medium text-white">Connect wallet to mint</span>
            </div>
            <p className="text-[13px] text-white/70 mb-4">
              You need a wallet connected to Arc Testnet to mint NFTs. USDC is used for gas and mint payments.
            </p>
            <button
              onClick={login}
              className="arc-btn text-sm px-6 py-2.5"
            >
              Sign In to Mint
            </button>
          </div>
        )}

        {/* Balance Bar */}
        {isConnected && (
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 mb-8">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[11px] text-white/70">USDC Balance</span>
                <div className="text-[14px] mono text-white">{usdcBalFormatted} USDC</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <span className="text-[11px] text-white/70">Mint Price</span>
                <div className="text-[14px] mono text-[#E9A13F]">{priceFormatted} USDC</div>
              </div>
            </div>
            <a
              href="https://faucet.circle.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-[#E9A13F] hover:underline flex items-center gap-1"
            >
              Get USDC <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Progress */}
        <div className="flex items-center gap-3 mb-12">
          {[
            { n: 1, label: "Design" },
            { n: 2, label: "Preview" },
            { n: 3, label: "Mint" },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-3">
              <div className={`flex items-center gap-2 ${step >= s.n ? "text-white" : "text-white/35"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-medium ${
                  step > s.n ? "bg-amber text-black" : step === s.n ? "border border-white/40 text-white" : "border border-white/10 text-white/35"
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
                <Sparkles className={`w-5 h-5 ${mode === "ai" ? "text-[#E9A13F]" : "text-white/70"}`} />
                <div className="text-left">
                  <div className={`text-[15px] font-medium ${mode === "ai" ? "text-white" : "text-white/60"}`}>
                    Generate with AI
                  </div>
                  <div className="text-[12px] text-white/70">Describe your vision</div>
                </div>
              </button>
              <button
                onClick={() => setMode("upload")}
                className={`flex-1 flex items-center justify-center gap-3 rounded-xl border p-5 transition-all duration-150 ${
                  mode === "upload" ? "border-[#E9A13F] bg-[#E9A13F]/5" : "border-white/10 hover:border-white/20"
                }`}
              >
                <Upload className={`w-5 h-5 ${mode === "upload" ? "text-[#E9A13F]" : "text-white/70"}`} />
                <div className="text-left">
                  <div className={`text-[15px] font-medium ${mode === "upload" ? "text-white" : "text-white/60"}`}>
                    Upload Design
                  </div>
                  <div className="text-[12px] text-white/70">Your own artwork</div>
                </div>
              </button>
            </div>

            {/* AI Mode */}
            {mode === "ai" && (
              <div>
                <label className="text-[13px] text-white/70 mb-3 block">Design prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Neon cyberpunk samurai with glowing katana on dark background"
                  rows={4}
                  className="w-full rounded-lg border border-white/10 bg-transparent p-4 text-[15px] text-white placeholder:text-white/35 focus:border-white/25 focus:outline-none resize-none transition-colors"
                />

                {/* Style presets */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {STYLES.map((s) => (
                    <button key={s} onClick={() => setStyle(style === s ? "" : s)}
                      className={`rounded-md px-3 py-1.5 text-[12px] transition-all duration-150 ${
                        style === s ? "bg-amber text-black" : "border border-white/10 text-white/70 hover:border-white/20"
                      }`}
                    >{s}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Mode */}
            {mode === "upload" && (
              <div>
                <label className="text-[13px] text-white/70 mb-3 block">Upload your design</label>

                {!uploadedPreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-xl border-2 border-dashed border-white/10 hover:border-white/20 p-10 text-center cursor-pointer transition-colors"
                  >
                    <ImageIcon className="w-10 h-10 text-white/70 mx-auto mb-4" />
                    <div className="text-[15px] text-white/70 mb-2">
                      Click to upload or drag and drop
                    </div>
                    <div className="text-[12px] text-white/35">
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
                        <div className="text-[12px] text-white/70 mt-1">
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
                    <label className="text-[13px] text-white/70 mb-3 block">Design title</label>
                    <input
                      type="text"
                      value={designTitle}
                      onChange={(e) => setDesignTitle(e.target.value)}
                      placeholder="e.g., Cosmic Dragon Tee"
                      className="w-full rounded-lg border border-white/10 bg-transparent p-3 text-[15px] text-white placeholder:text-white/35 focus:border-white/25 focus:outline-none transition-colors"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Product */}
            <div>
              <label className="text-[13px] text-white/70 mb-3 block">Product type</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
                {PRODUCTS.map((p) => (
                  <button key={p.id} onClick={() => setProduct(p.id)}
                    className={`rounded-lg border p-4 text-center transition-all duration-150 ${
                      product === p.id ? "border-amber bg-amber/5" : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="text-[28px] mb-2">{p.emoji}</div>
                    <div className="text-[12px] font-medium text-white">{p.name}</div>
                    <div className="text-[11px] text-white/70 mt-0.5">{p.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Edition */}
            <div>
              <label className="text-[13px] text-white/70 mb-3 block">Edition size</label>
              <input type="number" value={edition} onChange={(e) => setEdition(e.target.value)} min="1" max="1000"
                className="w-full rounded-lg border border-white/10 bg-transparent p-3 text-[15px] text-white focus:border-white/25 focus:outline-none transition-colors"
              />
              <p className="text-[11px] text-white/35 mt-2">Max 1000 per design</p>
            </div>

            {/* Generate / Continue */}
            {mode === "ai" ? (
              <div className="space-y-3">
                {/* Progress bar */}
                {generating && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-white/70">Generating your design...</span>
                      <span className="text-[#E9A13F] mono">{Math.round(generateProgress)}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-[#E9A13F] rounded-full transition-all duration-500"
                        style={{ width: `${generateProgress}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-white/35">
                      AI is creating your unique design. This takes 10-30 seconds.
                    </p>
                  </div>
                )}

                {/* Error */}
                {generateError && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                    <div className="text-[13px] text-red-400">{generateError}</div>
                  </div>
                )}

                <button onClick={() => handleGenerate(false)} disabled={!prompt.trim() || generating}
                  className="w-full btn-primary justify-center py-4 text-[16px] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {generating ? <><Loader2 className="h-4 w-4 animate-spin" />Generating...</> : <><Sparkles className="h-4 w-4" />Generate with AI</>}
                </button>
              </div>
            ) : (
              <button onClick={() => { setMetadataUri(`ipfs://QmArcMerchUpload/${Date.now()}`); setStep(2); }} disabled={!uploadedFile}
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
                ) : generatedImageUrl ? (
                  <div className="space-y-3">
                    <div className="aspect-square rounded-lg overflow-hidden bg-white/5">
                      <img src={generatedImageUrl} alt="AI generated design" className="w-full h-full object-contain" />
                    </div>
                    <button
                      onClick={() => handleGenerate(true)}
                      disabled={generating}
                      className="w-full btn-outline justify-center py-2.5 text-[13px] disabled:opacity-30"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Regenerate
                    </button>
                  </div>
                ) : (
                  <div className="aspect-square rounded-lg bg-white/5 flex items-center justify-center">
                    <div className="text-center">
                      <Sparkles className="w-10 h-10 text-white/70 mx-auto mb-3" />
                      <p className="text-[13px] text-white/35">No design generated</p>
                    </div>
                  </div>
                )}
                <p className="text-[11px] text-white/35 text-center mt-3">
                  {mode === "upload" ? "Your uploaded design" : generatedImageUrl ? "AI-generated unique design" : "Generate a design to preview"}
                </p>
              </div>

              {/* Details */}
              <div className="space-y-4">
                {mode === "ai" ? (
                  <>
                    <div className="rounded-lg border border-white/10 p-4">
                      <div className="text-[11px] text-white/70 mb-1">Prompt</div>
                      <div className="text-[14px] text-white">{prompt}</div>
                    </div>
                    {style && (
                      <div className="rounded-lg border border-white/10 p-4">
                        <div className="text-[11px] text-white/70 mb-1">Style</div>
                        <div className="text-[14px] text-white">{style}</div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="rounded-lg border border-white/10 p-4">
                    <div className="text-[11px] text-white/70 mb-1">Design</div>
                    <div className="text-[14px] text-white">{designTitle || uploadedFile?.name || "Custom upload"}</div>
                  </div>
                )}
                <div className="rounded-lg border border-white/10 p-4">
                  <div className="text-[11px] text-white/70 mb-1">Product</div>
                  <div className="text-[14px] text-white">{PRODUCTS.find(p => p.id === product)?.emoji} {PRODUCTS.find(p => p.id === product)?.name}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-white/10 p-4">
                    <div className="text-[11px] text-white/70 mb-1">Edition</div>
                    <div className="text-[20px] font-light text-white">{edition}</div>
                  </div>
                  <div className="rounded-lg border border-white/10 p-4">
                    <div className="text-[11px] text-white/70 mb-1">Mint Cost</div>
                    <div className="text-[20px] font-light text-amber">{priceFormatted} USDC</div>
                  </div>
                </div>

                {/* USDC Warning + Unified Balance */}
                {!hasEnoughUSDC && (
                  <div className="space-y-3">
                    <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                      <div className="text-[13px] text-red-400">
                        ⚠️ Insufficient USDC on Arc. You need {priceFormatted} USDC to mint.
                      </div>
                      <div className="text-[12px] text-white/70 mt-1">
                        Arc balance: {usdcBalFormatted} USDC
                      </div>
                    </div>

                    {/* Unified Balance hint */}
                    {parseFloat(totalUnified) > 0 && (
                      <div className="rounded-lg border border-[#E9A13F]/20 bg-[#E9A13F]/5 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-4 h-4 text-[#E9A13F]" />
                          <span className="text-[13px] font-medium text-[#E9A13F]">
                            You have {totalUnified} USDC across chains
                          </span>
                        </div>
                        <p className="text-[12px] text-white/70 mb-3">
                          Bridge your USDC to Arc to mint this NFT.
                        </p>
                        <Link
                          href="/bridge"
                          className="inline-flex items-center gap-2 text-[13px] text-[#E9A13F] hover:underline"
                        >
                          <Globe className="w-3 h-3" /> Open Bridge
                        </Link>
                      </div>
                    )}

                    {parseFloat(totalUnified) === 0 && (
                      <div className="flex gap-3">
                        <a
                          href="https://faucet.circle.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 rounded-lg border border-white/10 p-3 text-center text-[13px] text-white/60 hover:border-white/20 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 inline mr-1" />
                          Faucet
                        </a>
                        <Link
                          href="/bridge"
                          className="flex-1 rounded-lg border border-[#E9A13F]/20 p-3 text-center text-[13px] text-[#E9A13F] hover:bg-[#E9A13F]/5 transition-colors"
                        >
                          <Globe className="w-3 h-3 inline mr-1" />
                          Bridge USDC
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep(1)} className="flex-1 btn-outline justify-center">Back</button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!isConnected || !hasEnoughUSDC}
                    className="flex-1 btn-primary justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {!isConnected ? "Connect Wallet" : !hasEnoughUSDC ? "Insufficient USDC" : "Continue"} <ArrowRight className="h-4 w-4" />
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
              <p className="text-[14px] text-white/70 mb-10 max-w-[380px] mx-auto">
                {isSuccess
                  ? "NFT minted successfully! View on explorer."
                  : mode === "upload"
                    ? "Your original design will be minted as ERC-721 on Arc. Ownership permanently on-chain."
                    : "Your AI design will be minted as ERC-721 on Arc. Gas paid in USDC."
                }
              </p>

              {/* Transaction Status */}
              {hash && (
                <div className="mx-auto max-w-[320px] mb-6">
                  <a
                    href={`https://testnet.arcscan.app/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[13px] text-[#E9A13F] hover:underline"
                  >
                    View Transaction <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Error */}
              {mintError && (
                <div className="mx-auto max-w-[320px] mb-6 rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                  <div className="text-[13px] text-red-400">
                    {mintError.message.includes("User rejected") ? "Transaction cancelled" : `Error: ${mintError.message.slice(0, 100)}`}
                  </div>
                </div>
              )}

              {/* Success State */}
              {isSuccess ? (
                <div className="mx-auto max-w-[320px] space-y-4">
                  <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                    <div className="text-[14px] text-green-400 flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" /> NFT Minted Successfully!
                    </div>
                  </div>
                  <a
                    href={`https://testnet.arcscan.app/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-primary justify-center py-3 inline-flex items-center gap-2"
                  >
                    View on Explorer <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => {
                      setStep(1);
                      setPrompt("");
                      setUploadedFile(null);
                      setUploadedPreview(null);
                      setDesignTitle("");
                    }}
                    className="w-full btn-outline justify-center py-3"
                  >
                    Create Another
                  </button>
                </div>
              ) : (
                <>
                  <div className="mx-auto max-w-[320px] space-y-3 mb-10">
                    <div className="flex justify-between py-3 border-b border-white/[0.06]">
                      <span className="text-[13px] text-white/70">Mint Price</span>
                      <span className="mono text-[13px] text-white">{priceFormatted} USDC</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-white/[0.06]">
                      <span className="text-[13px] text-white/70">Gas (est.)</span>
                      <span className="mono text-[13px] text-white">~0.05 USDC</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-[14px] font-medium text-white">Total</span>
                      <span className="mono text-[14px] text-amber">~{(parseFloat(priceFormatted) + 0.05).toFixed(2)} USDC</span>
                    </div>
                  </div>

                  <div className="flex gap-3 max-w-[320px] mx-auto">
                    <button onClick={() => setStep(2)} className="flex-1 btn-outline justify-center">Back</button>

                    {needsApproval ? (
                      <button
                        onClick={handleApprove}
                        disabled={isApproving || isApproveConfirming}
                        className="flex-1 btn-primary justify-center disabled:opacity-50"
                      >
                        {isApproving || isApproveConfirming ? (
                          <><Loader2 className="h-4 w-4 animate-spin" /> Approving...</>
                        ) : (
                          <> Approve USDC</>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={handleMint}
                        disabled={isMinting || isConfirming}
                        className="flex-1 btn-primary justify-center disabled:opacity-50"
                      >
                        {isMinting ? (
                          <><Loader2 className="h-4 w-4 animate-spin" /> Confirm...</>
                        ) : isConfirming ? (
                          <><Loader2 className="h-4 w-4 animate-spin" /> Minting...</>
                        ) : (
                          <>🔥 {mode === "upload" ? "Mint Original" : "Mint NFT"}</>
                        )}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            <p className="text-[11px] text-white/35 text-center">
              By minting you agree to ArcMerch terms. NFTs minted on Arc Testnet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
