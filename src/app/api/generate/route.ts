import { NextRequest, NextResponse } from "next/server";

// Pollinations.ai — free AI image generation, no API key
const POLLINATIONS_BASE = "https://image.pollinations.ai/prompt";

// Style modifiers for better merch designs
const STYLE_MODIFIERS: Record<string, string> = {
  realistic: "photorealistic, detailed, high quality, 4k",
  anime: "anime style, vibrant colors, cel shading, manga art",
  "pixel art": "pixel art style, retro gaming, 8-bit aesthetic, nostalgic",
  watercolor: "watercolor painting, soft edges, artistic, hand-painted feel",
  cyberpunk: "cyberpunk neon, futuristic, glowing lights, dark atmosphere",
  minimalist: "minimalist design, clean lines, simple shapes, modern art",
  graffiti: "graffiti street art, spray paint, urban, bold colors",
  "3d render": "3D rendered, octane render, volumetric lighting, detailed",
};

// Prompt enhancement for merchandise designs
function enhancePrompt(prompt: string, style?: string, product?: string): string {
  const parts: string[] = [];

  // Base prompt
  parts.push(prompt);

  // Style modifier
  if (style && STYLE_MODIFIERS[style.toLowerCase()]) {
    parts.push(STYLE_MODIFIERS[style.toLowerCase()]);
  }

  // Product context
  const productContext: Record<string, string> = {
    tshirt: "t-shirt design, printable artwork, centered composition, transparent background suitable for merchandise",
    hoodie: "hoodie design, large print artwork, bold graphic, merchandise ready",
    cap: "cap embroidery design, compact circular composition, clean vector style",
    mug: "mug wraparound design, seamless pattern, cylindrical print ready",
    poster: "poster art, vertical composition, high detail, gallery quality",
  };

  if (product && productContext[product]) {
    parts.push(productContext[product]);
  }

  // Quality boosters
  parts.push("high quality, professional design, unique artwork");

  return parts.join(", ");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const prompt = searchParams.get("prompt");
  const style = searchParams.get("style") || "";
  const product = searchParams.get("product") || "tshirt";
  const width = searchParams.get("width") || "512";
  const height = searchParams.get("height") || "512";
  const seed = searchParams.get("seed") || String(Math.floor(Math.random() * 100000));

  if (!prompt || prompt.trim().length < 3) {
    return NextResponse.json(
      { error: "Prompt must be at least 3 characters" },
      { status: 400 }
    );
  }

  // Rate limit: max 20 chars prompt to prevent abuse
  if (prompt.length > 500) {
    return NextResponse.json(
      { error: "Prompt too long (max 500 characters)" },
      { status: 400 }
    );
  }

  const enhancedPrompt = enhancePrompt(prompt, style, product);
  const encodedPrompt = encodeURIComponent(enhancedPrompt);

  const pollinationsUrl = `${POLLINATIONS_BASE}/${encodedPrompt}?width=${width}&height=${height}&model=flux&nologo=true&seed=${seed}`;

  try {
    const response = await fetch(pollinationsUrl, {
      headers: {
        "User-Agent": "ArcMerch/1.0",
      },
      // Cache for 1 hour to avoid re-generating same prompt
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Image generation failed. Try again." },
        { status: 502 }
      );
    }

    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "X-Enhanced-Prompt": enhancedPrompt.slice(0, 200),
      },
    });
  } catch (error) {
    console.error("Pollinations error:", error);
    return NextResponse.json(
      { error: "Image generation service unavailable" },
      { status: 503 }
    );
  }
}
