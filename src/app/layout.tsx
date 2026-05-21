import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { AuthProvider } from "@/lib/auth-provider";
import { AuthButton } from "@/components/auth-button";
import { Web3Provider } from "@/components/web3-provider";
import { WalletButton } from "@/components/wallet-button";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "ArcMerch — AI Merchandise on Arc",
  description: "AI-powered merchandise marketplace on Arc blockchain. Create, mint, trade, burn, and print.",
};

function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="flex h-[72px] items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image src="/logo.jpg" alt="ArcMerch" width={32} height={32} className="rounded-lg" />
            <span className="text-[17px] font-medium tracking-tight text-white">
              ArcMerch
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#E9A13F] bg-[#E9A13F]/10 border border-[#E9A13F]/20 rounded px-1.5 py-0.5 ml-1">
              Testnet
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/marketplace" className="text-[15px] text-white/60 hover:text-white transition-colors duration-150">
              Marketplace
            </Link>
            <Link href="/create" className="text-[15px] text-white/60 hover:text-white transition-colors duration-150">
              Create
            </Link>
            <Link href="/profile" className="text-[15px] text-white/60 hover:text-white transition-colors duration-150">
              Profile
            </Link>
          </div>

          {/* Auth + Wallet */}
          <div className="flex items-center gap-3">
            <WalletButton />
            <AuthButton />
          </div>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <Image src="/logo.jpg" alt="ArcMerch" width={22} height={22} className="rounded" />
              <span className="text-[15px] font-medium text-white">ArcMerch</span>
            </div>
            <p className="text-[14px] text-white/40 leading-relaxed max-w-[400px]">
              AI-powered merchandise marketplace on Arc blockchain. 
              Create designs with AI, mint as NFTs, and redeem physical products — all settled in USDC.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="section-label mb-4">Platform</h4>
            <ul className="space-y-3">
              {[
            { href: "/marketplace", label: "Marketplace" },
            { href: "/create", label: "Create" },
            { href: "/merchpaper", label: "Merchpaper" },
                { href: "/profile", label: "My Profile" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[14px] text-white/40 hover:text-white transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="section-label mb-4">Resources</h4>
            <ul className="space-y-3">
              {[
                { href: "https://docs.arc.io", label: "Arc Docs" },
                { href: "https://faucet.circle.com", label: "USDC Faucet" },
                { href: "https://testnet.arcscan.app", label: "Explorer" },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-[14px] text-white/40 hover:text-white transition-colors duration-150">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-[13px] text-white/25">© 2026 ArcMerch</span>
          <span className="text-[13px] text-white/25">Built on Arc — Circle&apos;s L1 where USDC is native gas</span>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="min-h-screen">
        <Web3Provider>
          <AuthProvider>
            <Navbar />
            <main className="pt-[72px]">{children}</main>
            <Footer />
          </AuthProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
