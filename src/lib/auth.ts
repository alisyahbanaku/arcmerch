/**
 * NextAuth v5 configuration
 * Supports: Twitter OAuth (production) + Credentials (demo/dev)
 * Twitter login = verified creator (✓ badge)
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Twitter from "next-auth/providers/twitter";
import { generateWallet } from "../lib/wallet";
import { storeWallet, getWallet, hasWallet } from "../lib/wallet-store";

// ── Providers ───────────────────────────────────────────────────

const providers = [];

// Twitter OAuth (production) — verified creator
if (process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CLIENT_SECRET) {
  providers.push(
    Twitter({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    })
  );
}

// Demo credentials (dev/testing — not verified)
providers.push(
  Credentials({
    name: "Demo Login",
    credentials: {
      username: { label: "Twitter Handle", type: "text", placeholder: "@yourhandle" },
    },
    authorize: async (credentials: Record<string, unknown> | undefined) => {
      if (!credentials?.username) return null;
      const handle = String(credentials.username).replace("@", "");
      return {
        id: `demo_${handle}`,
        name: handle,
        image: null,
        twitterHandle: `@${handle}`,
        verified: false, // Demo = not verified
      } as any;
    },
  })
);

// ── Auth Config ─────────────────────────────────────────────────

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: providers as any,
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user, account }: { token: any; user?: any; account?: any }) {
      if (user) {
        const userId = user.id;
        token.userId = userId;
        token.twitterHandle = user.twitterHandle || user.name;

        // Twitter OAuth = verified creator
        // account.provider === "twitter" means real OAuth login
        token.verified = account?.provider === "twitter" || user.verified === true;

        if (!hasWallet(userId)) {
          const sessionToken = token.jti || token.sub || userId;
          const walletData = generateWallet(userId, sessionToken);
          storeWallet(userId, walletData);
          token.walletAddress = walletData.address;
        } else {
          const existing = getWallet(userId);
          token.walletAddress = existing?.address;
        }
      }
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      session.user = {
        id: token.userId,
        name: token.twitterHandle,
        image: session.user?.image || null,
        twitterHandle: token.twitterHandle,
        walletAddress: token.walletAddress,
        verified: token.verified || false,
      };
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "arcmerch-dev-secret-change-in-prod",
});
