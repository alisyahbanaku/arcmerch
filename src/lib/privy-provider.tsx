"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { defineChain } from "viem";

// Arc Testnet
const arcTestnet = defineChain({
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.testnet.arc.network"] } },
  blockExplorers: { default: { name: "ArcScan", url: "https://testnet.arcscan.app" } },
  testnet: true,
});

export function PrivyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId="cmpge24f800eb0djvterj3nz8"
      config={{
        loginMethods: ["twitter", "google", "email", "wallet"],
        appearance: {
          theme: "dark",
          accentColor: "#E9A13F",
          logo: "/logo.jpg",
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
        defaultChain: arcTestnet,
        supportedChains: [arcTestnet],
      }}
    >
      {children}
    </PrivyProvider>
  );
}
