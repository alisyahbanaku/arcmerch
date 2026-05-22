/**
 * NextAuth v5 configuration
 * Supports: Twitter OAuth, Google OAuth, Credentials (demo/dev)
 * Twitter/Google login = verified creator (✓ badge)
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Twitter from "next-auth/providers/twitter";
import Google from "next-auth/providers/google";
import { generateWallet } from "../lib/wallet";
import { storeWallet, getWallet, hasWallet } from "../lib/wallet-store";

// ── Providers ───────────────────────────────────────────────────

const providers = [];

// Twitter OAuth 2.0 (production) — verified creator
if (process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CLIENT_SECRET) {
  providers.push(
    Twitter({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    })
  );
}

// Google OAuth — verified creator
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
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
        verified: false,
      } as any;
    },
  })
);

// ── Auth Config ─────────────────────────────────────────────────

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: providers as any,
  // Don't set custom pages — let NextAuth handle OAuth redirects internally
  // pages: { signIn: "/" },  // ← CAUSES BUG with providerId in v5 beta
  callbacks: {
    async jwt({ token, user, account }: { token: any; user?: any; account?: any }) {
      if (user) {
        const userId = user.id;
        token.userId = userId;
        token.twitterHandle = user.twitterHandle || user.name;

        // Twitter/Google OAuth = verified creator
        token.verified = account?.provider === "twitter" || account?.provider === "google" || user.verified === true;

        // Generate or retrieve wallet (deterministic — no sessionToken dependency)
        if (!hasWallet(userId)) {
          const walletData = generateWallet(userId);
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
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "build-placeholder-secret-min16chars",
});
