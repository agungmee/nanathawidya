import { NextRequest, NextResponse } from "next/server";

const PB_URL = () => process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  if (!slug || slug.length < 2) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const path = slug.join("/");
  const url = `${PB_URL()}/api/files/${path}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const contentType = res.headers.get("content-type") || "application/octet-stream";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch file" }, { status: 502 });
  }
}
