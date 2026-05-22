# ArcMerch — AI-Powered NFT Merchandise on Arc Blockchain

> **Track 4: Best Agentic Economy Experience on Arc**  
> The Stablecoins Commerce Stack Challenge (Ignyte × Circle × Arc)

![Architecture](public/architecture-diagram.svg)

## 🎯 What is ArcMerch?

ArcMerch is an **AI-powered NFT merchandise marketplace** where autonomous AI agents generate designs, mint them as ERC-721 NFTs on Arc blockchain, and enable a **burn-to-redeem** mechanic for physical merchandise — all settled in USDC with sub-cent nanopayments.

**Live Demo:** https://arcmerch.vercel.app  
**Contract (Verified):** [0x27881c74CF4Db0B361Bc67647046583C6e0f2162](https://testnet.arcscan.app/address/0x27881c74CF4Db0B361Bc67647046583C6e0f2162)  
**Chain:** Arc Testnet (Chain ID: 5042002)

---

## 🤖 Agentic Commerce Flow

```
AI Agent (ERC-8004) → Generate Design → Nanopayment (0.001 USDC)
    ↓
Mint NFT (ERC-721) → USDC Payment → Creator Royalties
    ↓
Burn NFT → Create Job (ERC-8183) → USDC Escrow
    ↓
Printer Agent Fulfills → Proof of Delivery → Release Escrow
    ↓
Reputation Update → ReputationRegistry (ERC-8004)
```

**Key Innovation:** The entire lifecycle — from AI design generation to physical merchandise delivery — is orchestrated by autonomous agents settling in USDC on Arc, with every step verifiable on-chain.

---

## 🔧 Circle Products Used on Arc

| Product | Usage in ArcMerch |
|---------|-------------------|
| **USDC** | Primary settlement rail — mint payments, escrow, royalties, nanopayments |
| **Nanopayments** | Sub-cent (0.001 USDC) micro fees per AI design generation — pay-per-inference |
| **Circle Wallets** | Embedded wallets via Privy for non-crypto-native users (Twitter/Google login) |
| **CCTP + Bridge Kit** | Cross-chain USDC bridging for multi-chain buyers |
| **Arc ERC-8004** | AI Design Agent registered with on-chain identity + reputation |
| **Arc ERC-8183** | Print fulfillment jobs with USDC escrow + milestone-based release |

---

## 🏗️ Tech Stack

- **Frontend:** Next.js 16, TypeScript, Tailwind CSS
- **Auth:** Privy (Twitter, Google, Email, Wallet)
- **Blockchain:** Arc Testnet, viem, ERC-721
- **AI:** Pollinations.ai (free, keyless image generation)
- **Storage:** Pinata IPFS (metadata) / Base64 data URI (fallback)
- **Hosting:** Vercel (Edge)
- **Smart Contracts:** Solidity, Foundry

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/alisyahbanaku/arcmerch.git
cd arcmerch
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
# Required
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_secret

# Optional (enhances functionality)
PINATA_JWT=your_pinata_jwt_for_ipfs
TREASURY_ADDRESS=your_treasury_wallet
DEPLOYER_PRIVATE_KEY=your_deployer_key

# Arc Testnet (pre-configured)
NEXT_PUBLIC_ARC_RPC=https://rpc.testnet.arc.network
NEXT_PUBLIC_CHAIN_ID=5042002
```

### Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

### Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
arcmerch/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage — hero, featured, how-it-works
│   │   ├── marketplace/          # Browse + buy NFT merch
│   │   ├── create/               # AI generate or upload → mint
│   │   ├── ecosystem/            # Arc ecosystem integrations dashboard
│   │   ├── bridge/               # Cross-chain USDC bridge (CCTP)
│   │   ├── profile/              # User profile + holdings
│   │   ├── merchpaper/           # Whitepaper (18 sections)
│   │   └── api/
│   │       ├── generate/         # AI image generation (Pollinations)
│   │       ├── upload/           # IPFS metadata upload
│   │       ├── nfts/             # On-chain NFT query
│   │       ├── nanopay/          # Nanopayments micro fees
│   │       └── debug/            # Health check
│   ├── hooks/
│   │   ├── useArcMerch.ts        # NFT contract interactions
│   │   ├── useArcEcosystem.ts    # ERC-8004, ERC-8183, reputation
│   │   └── useAppKit.ts          # Bridge + unified balance
│   ├── lib/
│   │   ├── contracts.ts          # ABI + addresses
│   │   ├── arc-ecosystem.ts      # Ecosystem contract configs
│   │   └── agent-metadata.ts     # AI agent ERC-8004 metadata
│   └── components/
│       ├── navbar.tsx
│       └── providers.tsx
├── contracts/
│   └── foundry/
│       └── src/ArcMerchNFT.sol   # ERC-721 + burn + USDC + royalties
├── public/
│   ├── architecture.html         # Interactive architecture diagram
│   ├── architecture-diagram.svg  # Static diagram for docs
│   └── mockups/                  # Product mockup images
└── package.json
```

---

## 🔐 Smart Contract

**ArcMerchNFT** (ERC-721) — deployed and verified on Arc Testnet

Features:
- USDC-denominated mint price (6 decimals)
- Edition system (max editions per design)
- Burn-to-redeem mechanic
- Creator royalties (5%)
- Platform fee (2.5%)
- Product type metadata (T-Shirt, Hoodie, Cap, etc.)
- Owner-controlled minting + pausing

```solidity
// Key functions
function mintWithUSDC(string uri, string productType, string designTitle, uint256 maxEditions, address to)
function burn(uint256 tokenId)  // Triggers physical redemption
function getEditionInfo(uint256 tokenId) → (maxEditions, minted, productType, title, creator)
```

---

## 🧪 Testing

```bash
# Smart contract tests (requires Foundry)
cd contracts/foundry
forge test -vvv

# Frontend build verification
npm run build
```

All 12 contract tests pass ✅

---

## 📊 Circle Product Feedback

### Why We Chose These Products

1. **USDC on Arc** — Predictable dollar-denominated fees make pricing merchandise straightforward. No ETH volatility for end users.
2. **Nanopayments** — Perfect for pay-per-inference AI generation. Users pay 0.001 USDC per design, making AI accessible without subscription models.
3. **ERC-8004 (Agent Identity)** — Gives our AI Design Agent a verifiable on-chain identity with reputation tracking.
4. **ERC-8183 (Job Settlement)** — Escrow-based fulfillment is exactly what print-on-demand needs: milestone-based payment release.
5. **CCTP + Bridge Kit** — Users on other chains can bridge USDC to Arc seamlessly.

### What Worked Well

- **Arc's sub-second finality** — Mint transactions confirm instantly, great UX
- **USDC as native gas** — Eliminates the "buy ETH first" onboarding friction
- **ERC-8183 escrow pattern** — Clean separation of concerns for multi-party commerce
- **Deterministic fees** — Can show exact costs upfront, no gas estimation surprises
- **Arc docs + sample apps** — Clear examples for contract deployment and interaction

### What Could Be Improved

- **Nanopayments SDK** — Would love a client-side SDK that handles approve + transfer in one UX step (currently requires 2 transactions)
- **ERC-8004 tooling** — A CLI or dashboard to register/manage agents would speed up development
- **Testnet faucet** — Sometimes slow; a programmatic faucet API would help CI/CD
- **CCTP documentation** — More examples of cross-chain flows with code snippets would help
- **Explorer verification** — Arcscan verification could support more Solidity versions and constructor arg encoding helpers

### Recommendations

1. **Batch nanopayments** — Allow pre-funding a "credit balance" that auto-deducts per use, reducing transaction count
2. **Agent marketplace** — A registry UI where users can discover and hire registered ERC-8004 agents
3. **Webhook notifications** — Push notifications when ERC-8183 jobs change state (funded → submitted → completed)
4. **Template contracts** — Pre-audited NFT + marketplace templates with USDC integration built-in (like Circle's ERC-721 template but with burn mechanics)

---

## 🗺️ Roadmap

- [x] Phase 1: Frontend UI (arc.io design language)
- [x] Phase 2: ERC-721 smart contract + USDC payments
- [x] Phase 3: AI design generation + IPFS metadata
- [x] Phase 4: Arc ecosystem integration (ERC-8004, ERC-8183)
- [x] Phase 5: Nanopayments + on-chain marketplace
- [ ] Phase 6: Secondary marketplace (buy/sell between users)
- [ ] Phase 7: Print partner integration + physical fulfillment
- [ ] Phase 8: Mainnet deployment

---

## 📄 License

MIT

---

## 🔗 Links

- **Live Demo:** https://arcmerch.vercel.app
- **Merchpaper:** https://arcmerch.vercel.app/merchpaper
- **Ecosystem:** https://arcmerch.vercel.app/ecosystem
- **GitHub:** https://github.com/alisyahbanaku/arcmerch
- **Contract:** https://testnet.arcscan.app/address/0x27881c74CF4Db0B361Bc67647046583C6e0f2162
- **Arc Docs:** https://docs.arc.io
- **Circle Docs:** https://developers.circle.com

---

*Built with ❤️ on Arc Blockchain for the Stablecoins Commerce Stack Challenge*
