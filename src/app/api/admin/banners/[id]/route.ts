import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const PB_URL = () => process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';

async function getAdminToken() {
  const email = process.env.POCKETBASE_ADMIN_EMAIL;
  const password = process.env.POCKETBASE_ADMIN_PASSWORD;
  const res = await fetch(`${PB_URL()}/api/collections/_superusers/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: email, password }),
  });
  if (!res.ok) return "";
  const data = await res.json();
  return data.token || "";
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const token = await getAdminToken();
    const role = (session.user as any).role;
    const storeId = (session.user as any).storeId;

    if (role !== 'admin' && storeId) {
      const checkRes = await fetch(`${PB_URL()}/api/collections/banners/records/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (checkRes.ok) {
        const existing = await checkRes.json();
        if (existing.storeId !== storeId) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }
    }

    const body = await req.json();
    const data: Record<string, unknown> = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.subtitle !== undefined) data.subtitle = body.subtitle;
    if (body.image !== undefined) data.image = body.image;
    if (body.url !== undefined) data.url = body.url;
    if (body.isActive !== undefined) data.isActive = body.isActive;
    if (body.sortOrder !== undefined) data.sortOrder = body.sortOrder;

    const res = await fetch(`${PB_URL()}/api/collections/banners/records/${params.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update');
    const banner = await res.json();
    return NextResponse.json(banner);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const token = await getAdminToken();
    const role = (session.user as any).role;
    const storeId = (session.user as any).storeId;

    if (role !== 'admin' && storeId) {
      const checkRes = await fetch(`${PB_URL()}/api/collections/banners/records/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (checkRes.ok) {
        const existing = await checkRes.json();
        if (existing.storeId !== storeId) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }
    }

    const res = await fetch(`${PB_URL()}/api/collections/banners/records/${params.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to delete');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
