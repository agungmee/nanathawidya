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
    const qs = filter ? `filter=${encodeURIComponent(filter)}&sort=name` : 'sort=name';
    const res = await fetch(`${PB_URL()}/api/collections/categories/records?${qs}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const pageData = await res.json();
    const categories = pageData.items || [];

    const mapped = await Promise.all(categories.map(async (c: any) => {
      const prodParams = new URLSearchParams({ filter: `categoryId = "${c.id}"`, fields: 'id' });
      const prodRes = await fetch(`${PB_URL()}/api/collections/products/records?${prodParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let productCount = 0;
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        productCount = (prodData.items || []).length;
      }
      return {
        id: c.id,
        name: c.name,
        slug: c.slug,
        image: c.image || null,
        description: c.description || null,
        _count: { products: productCount },
      };
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error('Admin categories fetch error:', error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const token = await getAdminToken();
    const body = await req.json();
    const storeId = (session.user as any).storeId;

    const res = await fetch(`${PB_URL()}/api/collections/categories/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: body.description || null,
        image: body.image || null,
        storeId: storeId,
      }),
    });
    if (!res.ok) throw new Error('Failed to create category');
    const category = await res.json();
    return NextResponse.json(category);
  } catch (error) {
    console.error('Admin category create error:', error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
