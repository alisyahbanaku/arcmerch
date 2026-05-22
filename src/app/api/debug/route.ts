import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasAuthSecret: !!process.env.AUTH_SECRET,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasAuthUrl: !!process.env.AUTH_URL,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    hasTwitterId: !!process.env.TWITTER_CLIENT_ID,
    hasTwitterSecret: !!process.env.TWITTER_CLIENT_SECRET,
    hasPlatformSecret: !!process.env.PLATFORM_WALLET_SECRET,
    authUrl: process.env.AUTH_URL || process.env.NEXTAUTH_URL || "MISSING",
    nodeEnv: process.env.NODE_ENV,
  });
}
