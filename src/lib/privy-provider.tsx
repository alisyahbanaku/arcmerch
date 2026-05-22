"use client";

import { PrivyProvider } from "@privy-io/react-auth";

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
      }}
    >
      {children}
    </PrivyProvider>
  );
}
