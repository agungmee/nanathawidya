import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/pocketbase";
import { auth } from "@/lib/auth";

const KNOWN_KEYS = ["wa_phone", "company_email", "company_address", "company_city", "company_province", "company_desc", "operational_hours"];

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const pb = await getAdminClient();
    const store = await pb.collection('stores').getFirstListItem(`slug="${process.env.POCKETBASE_STORE_SLUG || 'nanathawidya'}"`);

    const settings = await pb.collection('settings').getFullList({
      filter: `storeId = "${store.id}"`,
    });

    const result: Record<string, unknown> = {};
    for (const s of settings) {
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
    const pb = await getAdminClient();
    const store = await pb.collection('stores').getFirstListItem(`slug="${process.env.POCKETBASE_STORE_SLUG || 'nanathawidya'}"`);

    const body = await req.json();

    for (const key of KNOWN_KEYS) {
      if (body[key] === undefined) continue;

      // Check if setting exists
      let existing: any = null;
      try {
        existing = await pb.collection('settings').getFirstListItem(`key="${key}"`);
      } catch {}

      if (existing) {
        await pb.collection('settings').update(existing.id, { value: body[key] });
      } else {
        await pb.collection('settings').create({ key, value: body[key], storeId: store.id });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
