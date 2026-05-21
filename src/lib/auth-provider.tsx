"use client";

import { SessionProvider as NextAuthSessionProvider, useSession, signIn, signOut } from "next-auth/react";
import { createContext, useContext, ReactNode } from "react";

// ── Types ───────────────────────────────────────────────────────

interface ArcMerchUser {
  id: string;
  name: string;
  twitterHandle: string;
  walletAddress: string;
  image: string | null;
  verified: boolean;
}

interface AuthContextType {
  user: ArcMerchUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: () => {},
  signOut: () => {},
});

// ── Provider ────────────────────────────────────────────────────

function AuthProviderInner({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const user: ArcMerchUser | null = session?.user
    ? {
        id: (session.user as any).id,
        name: session.user.name || "",
        twitterHandle: (session.user as any).twitterHandle || session.user.name || "",
        walletAddress: (session.user as any).walletAddress || "",
        image: session.user.image || null,
        verified: (session.user as any).verified || false,
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!session,
        isLoading: status === "loading",
        signIn: () => signIn(),
        signOut: () => signOut(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </NextAuthSessionProvider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
