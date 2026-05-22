import { handlers } from "../../../../lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const res = await handlers.GET(req);
    // Log redirect to error
    if (res.status === 302) {
      const loc = res.headers.get("location") ?? "";
      if (loc.includes("error")) {
        console.error("[ARCmerch] Auth callback redirect to error:", loc);
        // Return a debug response with the actual error
        return NextResponse.json({
          error: "callback_failed",
          redirect: loc,
          url: req.url,
          status: res.status,
        });
      }
    }
    return res;
  } catch (e: unknown) {
    const err = e as Error;
    console.error("[ARCmerch] Auth callback CRASH:", err?.message, err?.cause);
    return NextResponse.json({
      error: "crash",
      message: err?.message,
      cause: String(err?.cause),
      stack: err?.stack?.split("\n").slice(0, 5),
    });
  }
}

export const POST = handlers.POST;
