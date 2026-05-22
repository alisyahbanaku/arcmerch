import { NextRequest, NextResponse } from "next/server";

// Upload image + metadata to IPFS via Pinata (free tier: 1GB)
// If no Pinata key configured, falls back to base64 data URI

const PINATA_JWT = process.env.PINATA_JWT || "";
const PINATA_GATEWAY = process.env.PINATA_GATEWAY || "https://gateway.pinata.cloud/ipfs";

interface MintMetadata {
  name: string;
  description: string;
  image: string; // IPFS URI or data URI
  attributes: Array<{ trait_type: string; value: string }>;
  external_url?: string;
}

async function uploadToPinata(file: File | Blob, filename: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file, filename);
  formData.append("pinataMetadata", JSON.stringify({ name: filename }));

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: { Authorization: `Bearer ${PINATA_JWT}` },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Pinata upload failed: ${err}`);
  }

  const data = await res.json();
  return `ipfs://${data.IpfsHash}`;
}

async function uploadJsonToPinata(json: object, name: string): Promise<string> {
  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pinataContent: json,
      pinataMetadata: { name },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Pinata JSON upload failed: ${err}`);
  }

  const data = await res.json();
  return `ipfs://${data.IpfsHash}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File | null;
    const imageUrl = formData.get("imageUrl") as string | null;
    const name = formData.get("name") as string || "ArcMerch Design";
    const description = formData.get("description") as string || "";
    const productType = formData.get("productType") as string || "T-Shirt";
    const style = formData.get("style") as string || "";
    const edition = formData.get("edition") as string || "10";
    const creator = formData.get("creator") as string || "";

    let imageUri: string;

    // Step 1: Upload image to IPFS
    if (PINATA_JWT) {
      // Use Pinata
      if (image) {
        imageUri = await uploadToPinata(image, `arcmerch-${Date.now()}.png`);
      } else if (imageUrl) {
        // Fetch the generated image and upload
        const imgRes = await fetch(imageUrl);
        if (!imgRes.ok) throw new Error("Failed to fetch generated image");
        const blob = await imgRes.blob();
        imageUri = await uploadToPinata(blob, `arcmerch-${Date.now()}.png`);
      } else {
        return NextResponse.json({ error: "No image provided" }, { status: 400 });
      }
    } else {
      // Fallback: use the image URL directly (Pollinations URL or data URI)
      if (imageUrl) {
        imageUri = imageUrl;
      } else if (image) {
        // Convert to base64 data URI as last resort
        const buffer = await image.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        imageUri = `data:${image.type};base64,${base64}`;
      } else {
        return NextResponse.json({ error: "No image provided" }, { status: 400 });
      }
    }

    // Step 2: Build ERC-721 metadata (OpenSea standard)
    const metadata: MintMetadata = {
      name,
      description: description || `${name} — AI-generated merchandise on ArcMerch`,
      image: imageUri,
      external_url: "https://arcmerch.vercel.app",
      attributes: [
        { trait_type: "Product Type", value: productType },
        { trait_type: "Style", value: style || "Custom" },
        { trait_type: "Max Editions", value: edition },
        { trait_type: "Creator", value: creator },
        { trait_type: "Platform", value: "ArcMerch" },
        { trait_type: "Chain", value: "Arc Testnet" },
      ],
    };

    // Step 3: Upload metadata JSON to IPFS
    let metadataUri: string;
    if (PINATA_JWT) {
      metadataUri = await uploadJsonToPinata(metadata, `arcmerch-metadata-${Date.now()}`);
    } else {
      // Fallback: return metadata as data URI
      const metadataJson = JSON.stringify(metadata);
      const metadataBase64 = Buffer.from(metadataJson).toString("base64");
      metadataUri = `data:application/json;base64,${metadataBase64}`;
    }

    return NextResponse.json({
      success: true,
      metadataUri,
      imageUri,
      metadata,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
