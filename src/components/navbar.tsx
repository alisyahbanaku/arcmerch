"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { AuthButton } from "@/components/auth-button";

const NAV_LINKS = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/create", label: "Create" },
  { href: "/bridge", label: "Bridge" },
  { href: "/profile", label: "Profile" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change or resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/[0.06]">
        <nav className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10">
          <div className="flex h-[60px] sm:h-[72px] items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
              <Image src="/logo.jpg" alt="ArcMerch" width={28} height={28} className="rounded-lg sm:w-8 sm:h-8" />
              <span className="text-[15px] sm:text-[17px] font-medium tracking-tight text-white">
                ArcMerch
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-[#E9A13F] bg-[#E9A13F]/10 border border-[#E9A13F]/20 rounded px-1.5 py-0.5 ml-1">
                Testnet
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[15px] text-white/60 hover:text-white transition-colors duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth + Wallet + Hamburger */}
            <div className="flex items-center gap-2 sm:gap-3">
              <AuthButton />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Menu Panel */}
          <div className="absolute top-[60px] left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/[0.06]">
            <div className="px-4 py-6 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] text-white/70 hover:text-white hover:bg-white/[0.04] transition-all duration-150"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-white/[0.06]">
                <Link
                  href="/merchpaper"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[14px] text-white/40 hover:text-white/60 transition-colors"
                >
                  Merchpaper
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
