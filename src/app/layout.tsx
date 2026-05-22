import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { PrivyWrapper } from "@/lib/privy-provider";
import { WalletProvider } from "@/lib/wallet-context";

import { Navbar } from "@/components/navbar";

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

function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <Image src="/logo.jpg" alt="ArcMerch" width={22} height={22} className="rounded" />
              <span className="text-[15px] font-medium text-white">ArcMerch</span>
            </div>
            <p className="text-sm sm:text-[14px] text-white/40 leading-relaxed max-w-[400px]">
              AI-powered merchandise marketplace on Arc blockchain. 
              Create designs with AI, mint as NFTs, and redeem physical products — all settled in USDC.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="section-label mb-4">Platform</h4>
            <ul className="space-y-2.5 sm:space-y-3">
              {[
                { href: "/marketplace", label: "Marketplace" },
                { href: "/create", label: "Create" },
                { href: "/ecosystem", label: "Ecosystem" },
                { href: "/bridge", label: "Bridge" },
                { href: "/merchpaper", label: "Merchpaper" },
                { href: "/profile", label: "My Profile" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm sm:text-[14px] text-white/40 hover:text-white transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="section-label mb-4">Resources</h4>
            <ul className="space-y-2.5 sm:space-y-3">
              {[
                { href: "https://docs.arc.io", label: "Arc Docs" },
                { href: "https://faucet.circle.com", label: "USDC Faucet" },
                { href: "https://testnet.arcscan.app", label: "Explorer" },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm sm:text-[14px] text-white/40 hover:text-white transition-colors duration-150">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <span className="text-xs sm:text-[13px] text-white/40">© 2026 ArcMerch</span>
          <span className="text-xs sm:text-[13px] text-white/40 text-center sm:text-right">Built on Arc — Circle&apos;s L1 where USDC is native gas</span>
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
        <PrivyWrapper>
          <WalletProvider>
            <Navbar />
            <main className="pt-[60px] sm:pt-[72px]">{children}</main>
            <Footer />
          </WalletProvider>
        </PrivyWrapper>
      </body>
    </html>
  );
}
