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

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const token = await getAdminToken();
    const role = (session.user as any).role;
    const storeId = (session.user as any).storeId;

    let filter = '';
    if (role !== 'admin' && storeId) {
      filter = `storeId = "${storeId}"`;
    }
    const qs = filter
      ? `filter=${encodeURIComponent(filter)}&sort=sortOrder`
      : 'sort=sortOrder';
    const res = await fetch(`${PB_URL()}/api/collections/banners/records?${qs}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch banners');
    const data = await res.json();
    return NextResponse.json(data.items || []);
  } catch {
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const token = await getAdminToken();
    const body = await req.json();
    const storeId = (session.user as any).storeId;

    const existingRes = await fetch(`${PB_URL()}/api/collections/banners/records?sort=-sortOrder&fields=sortOrder`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    let nextSortOrder = 1;
    if (existingRes.ok) {
      const existingData = await existingRes.json();
      const items = existingData.items || [];
      nextSortOrder = (items[0]?.sortOrder ?? 0) + 1;
    }

    const res = await fetch(`${PB_URL()}/api/collections/banners/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: body.title || "",
        subtitle: body.subtitle || "",
        image: body.image || "",
        url: body.url || "",
        isActive: body.isActive ?? true,
        sortOrder: nextSortOrder,
        storeId: storeId,
      }),
    });
    if (!res.ok) throw new Error('Failed to create banner');
    const banner = await res.json();
    return NextResponse.json(banner);
  } catch {
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}
