import { NextResponse } from "next/server";

const PB_URL = () => process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const slug = process.env.POCKETBASE_STORE_SLUG || 'nanathawidya';
    const storeRes = await fetch(`${PB_URL()}/api/collections/stores/records?filter=${encodeURIComponent(`slug="${slug}"`)}`, { cache: 'no-store' });
    if (!storeRes.ok) return NextResponse.json({ pb_debug: `store fetch failed: ${storeRes.status}` });
    const storeData = await storeRes.json();
    const store = storeData.items?.[0];
    if (!store) return NextResponse.json({ pb_debug: 'store not found', slug, pb_url: PB_URL() });

    const rawLogo = store.logo || "";
    let logoUrl = rawLogo;
    if (logoUrl.startsWith(`${PB_URL()}/api/files/`)) {
      logoUrl = `/api/files/${logoUrl.slice(PB_URL().length + 11)}`;
    }

    const result: Record<string, unknown> = {
      company_name: store.name || "",
      logo: logoUrl,
      description: store.description || "",
      _debug: { rawLogo, pbUrl: PB_URL() },
    };

    // Fetch key-value settings
    const qs = `filter=${encodeURIComponent(`storeId = "${store.id}"`)}`;
    const settingsRes = await fetch(`${PB_URL()}/api/collections/settings/records?${qs}`, { cache: 'no-store' });
    if (settingsRes.ok) {
      const settingsData = await settingsRes.json();
      for (const s of settingsData.items || []) {
        result[s.key] = s.value;
      }
    }

    const res = NextResponse.json(result);
    return res;
  } catch (err) {
    return NextResponse.json({ pb_debug: `error: ${err instanceof Error ? err.message : 'unknown'}` });
  }
}
