import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const PB_URL = () => process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';

async function getAdminToken() {
  const email = process.env.POCKETBASE_ADMIN_EMAIL;
  const password = process.env.POCKETBASE_ADMIN_PASSWORD;
  if (!email || !password) return "";
  const res = await fetch(`${PB_URL()}/api/collections/_superusers/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: email, password }),
  });
  if (!res.ok) return "";
  const data = await res.json();
  return data.token || "";
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File terlalu besar (maks 2MB)" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Hanya file gambar yang diizinkan" }, { status: 400 });
    }

    const token = await getAdminToken();
    if (!token) return NextResponse.json({ error: "Server config error" }, { status: 500 });

    const bytes = await file.arrayBuffer();
    const blob = new Blob([bytes], { type: file.type });
    const pbFormData = new FormData();
    pbFormData.append("file", blob, file.name);

    const res = await fetch(`${PB_URL()}/api/collections/uploads/records`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: pbFormData,
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Upload ke storage gagal" }, { status: 502 });
    }

    const data = await res.json();
    const url = `/api/files/uploads/${data.id}/${data.file}`;

    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
