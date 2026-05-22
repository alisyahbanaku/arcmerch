"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";

export type WalletInfo = {
  address: string;
  type: "embedded" | "external";
  label: string;
  walletClientType: string;
};

type WalletContextType = {
  allWallets: WalletInfo[];
  activeWallet: WalletInfo | null;
  setActiveWallet: (address: string) => void;
  connectExternalWallet: () => void;
  getProvider: () => Promise<any>;
};

const WalletContext = createContext<WalletContextType>({
  allWallets: [],
  activeWallet: null,
  setActiveWallet: () => {},
  connectExternalWallet: () => {},
  getProvider: async () => null,
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const { connectWallet } = usePrivy();
  const { wallets } = useWallets();
  const [activeAddress, setActiveAddress] = useState<string>("");

  // Map Privy wallets to our format
  const allWallets: WalletInfo[] = wallets.map(w => ({
    address: w.address,
    type: w.walletClientType === "privy" ? "embedded" : "external",
    label: w.walletClientType === "privy" ? "ArcMerch Wallet" : w.walletClientType,
    walletClientType: w.walletClientType,
  }));

  // Auto-select embedded wallet as default, or first available
  useEffect(() => {
    if (!activeAddress && allWallets.length > 0) {
      const embedded = allWallets.find(w => w.type === "embedded");
      setActiveAddress(embedded?.address || allWallets[0].address);
    }
  }, [allWallets, activeAddress]);

  const activeWallet = allWallets.find(w => w.address === activeAddress) || allWallets[0] || null;

  const setActiveWallet = (address: string) => {
    setActiveAddress(address);
  };

  const connectExternalWallet = () => {
    connectWallet();
  };

  const getProvider = async () => {
    const privyWallet = wallets.find(w => w.address === activeAddress) || wallets[0];
    if (!privyWallet) return null;
    return await privyWallet.getEthereumProvider();
  };

  return (
    <WalletContext.Provider value={{ allWallets, activeWallet, setActiveWallet, connectExternalWallet, getProvider }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useActiveWallet() {
  return useContext(WalletContext);
}
