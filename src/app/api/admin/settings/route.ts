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

const KNOWN_SETTINGS = [
  "wa_phone", "company_email", "company_address", "company_city",
  "company_province", "company_desc", "operational_hours",
];

async function getStore(token: string) {
  const slug = process.env.POCKETBASE_STORE_SLUG || 'nanathawidya';
  const res = await fetch(`${PB_URL()}/api/collections/stores/records?filter=${encodeURIComponent(`slug="${slug}"`)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Store not found');
  const data = await res.json();
  return data.items?.[0];
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const token = await getAdminToken();
    const store = await getStore(token);

    const qs = `filter=${encodeURIComponent(`storeId = "${store.id}"`)}`;
    const res = await fetch(`${PB_URL()}/api/collections/settings/records?${qs}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch settings');
    const data = await res.json();

    let logoUrl = store.logo || "";
    if (logoUrl.startsWith(`${PB_URL()}/api/files/`)) {
      logoUrl = `/api/files/${logoUrl.slice(PB_URL().length + 11)}`;
    }

    const result: Record<string, unknown> = {
      company_name: store.name || "PT. Nirwasita Athawidya Nusantara",
      logo: logoUrl,
      description: store.description || "",
    };

    for (const s of data.items || []) {
      result[s.key] = s.value;
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const token = await getAdminToken();
    const body = await req.json();
    const store = await getStore(token);

    // Update store fields
    const storeUpdates: Record<string, unknown> = {};
    if (body.company_name !== undefined) storeUpdates.name = body.company_name;
    if (body.logo !== undefined) storeUpdates.logo = body.logo;
    if (body.description !== undefined) storeUpdates.description = body.description;

    if (Object.keys(storeUpdates).length > 0) {
      await fetch(`${PB_URL()}/api/collections/stores/records/${store.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(storeUpdates),
      });
    }

    // Update settings collection (key-value pairs)
    for (const key of KNOWN_SETTINGS) {
      if (body[key] === undefined) continue;

      let existingId: string | null = null;
      const checkQs = `filter=${encodeURIComponent(`key="${key}" && storeId = "${store.id}"`)}`;
      const checkRes = await fetch(`${PB_URL()}/api/collections/settings/records?${checkQs}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (checkData.items?.length > 0) {
          existingId = checkData.items[0].id;
        }
      }

      if (existingId) {
        await fetch(`${PB_URL()}/api/collections/settings/records/${existingId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ value: body[key] }),
        });
      } else {
        await fetch(`${PB_URL()}/api/collections/settings/records`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ key, value: body[key], storeId: store.id }),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
