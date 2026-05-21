"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useState, useRef, useEffect } from "react";

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const short = (a: string) => `${a.slice(0, 6)}...${a.slice(-4)}`;

  if (isConnected && address) {
    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="btn-outline text-[14px] px-4 py-2"
        >
          {short(address)}
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-[#111] border border-[#222] rounded-lg shadow-xl z-50">
            <a
              href={`https://testnet.arcscan.app/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2.5 text-sm text-[#aaa] hover:text-white hover:bg-[#1a1a1a] rounded-t-lg"
            >
              Explorer ↗
            </a>
            <button
              onClick={() => { disconnect(); setOpen(false); }}
              className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-[#1a1a1a] rounded-b-lg"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        const injected = connectors.find((c) => c.id === "injected");
        if (injected) connect({ connector: injected });
      }}
      disabled={isPending}
      className="btn-outline text-[14px] px-4 py-2"
    >
      {isPending ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
