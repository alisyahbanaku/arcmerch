"use client";

import { AppKit } from "@circle-fin/app-kit";
import { createViemAdapterFromProvider } from "@circle-fin/adapter-viem-v2";
import type { EIP1193Provider } from "viem";

// Singleton AppKit instance
let kitInstance: AppKit | null = null;

export function getAppKit(): AppKit {
  if (!kitInstance) {
    kitInstance = new AppKit();
  }
  return kitInstance;
}

// Create adapter from browser wallet (MetaMask/injected)
export async function createBrowserAdapter() {
  if (typeof window === "undefined") {
    throw new Error("Browser adapter can only be created in browser");
  }

  const provider = (window as any).ethereum as EIP1193Provider | undefined;
  if (!provider) {
    throw new Error("No wallet provider found. Please install MetaMask.");
  }

  return createViemAdapterFromProvider({ provider });
}

// Supported chains for ArcMerch (matching UnifiedBalanceChain enum)
export const SUPPORTED_CHAINS = [
  "Arc_Testnet",
  "Ethereum_Sepolia",
  "Base_Sepolia",
  "Arbitrum_Sepolia",
  "Optimism_Sepolia",
  "Polygon_Amoy_Testnet",
  "Avalanche_Fuji",
] as const;

export type SupportedChain = (typeof SUPPORTED_CHAINS)[number];

// Chain display names
export const CHAIN_DISPLAY: Record<string, string> = {
  Arc_Testnet: "Arc",
  Ethereum_Sepolia: "Ethereum",
  Base_Sepolia: "Base",
  Arbitrum_Sepolia: "Arbitrum",
  Optimism_Sepolia: "Optimism",
  Polygon_Amoy_Testnet: "Polygon",
  Avalanche_Fuji: "Avalanche",
};

// Chain icons (emoji fallback)
export const CHAIN_ICONS: Record<string, string> = {
  Arc_Testnet: "🔵",
  Ethereum_Sepolia: "⟠",
  Base_Sepolia: "🔷",
  Arbitrum_Sepolia: "🔵",
  Optimism_Sepolia: "🔴",
  Polygon_Amoy_Testnet: "🟣",
  Avalanche_Fuji: "🔺",
};
