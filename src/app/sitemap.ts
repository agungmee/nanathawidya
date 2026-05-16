import type { MetadataRoute } from "next";

const PB_URL = () => process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const BASE_URL = "https://nanathawidya.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    const slug = process.env.POCKETBASE_STORE_SLUG || 'nanathawidya';
    const storeRes = await fetch(`${PB_URL()}/api/collections/stores/records?filter=${encodeURIComponent(`slug="${slug}"`)}`);
    const store = (await storeRes.json())?.items?.[0];
    if (!store) return entries;

    const storeFilter = `storeId = "${store.id}"`;

    const [products, categories] = await Promise.all([
      fetch(`${PB_URL()}/api/collections/products/records?filter=${encodeURIComponent(`${storeFilter} && isActive = true`)}&fields=slug,updated&skipTotal=1`).then(r => r.json()),
      fetch(`${PB_URL()}/api/collections/categories/records?filter=${encodeURIComponent(storeFilter)}&fields=slug,updated&skipTotal=1`).then(r => r.json()),
    ]);

    for (const p of (products.items || [])) {
      entries.push({
        url: `${BASE_URL}/product/${p.slug}`,
        lastModified: new Date(p.updated),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      });
    }

    for (const c of (categories.items || [])) {
      entries.push({
        url: `${BASE_URL}/category/${c.slug}`,
        lastModified: new Date(c.updated),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      });
    }
  } catch {}

  return entries;
}
