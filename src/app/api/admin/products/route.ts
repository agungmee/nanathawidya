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
    const qs = filter ? `filter=${encodeURIComponent(filter)}&sort=name&expand=categoryId` : 'sort=name&expand=categoryId';
    const res = await fetch(`${PB_URL()}/api/collections/products/records?${qs}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch products');
    const pageData = await res.json();
    const products = pageData.items || [];

    const mapped = products.map((p: any) => {
      const cat = p.expand?.categoryId;
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        originalPrice: p.originalPrice || null,
        image: p.image || null,
        imageUrl: p.imageUrl || null,
        images: p.images || [],
        galleryUrls: p.galleryUrls || [],
        videoUrl: p.videoUrl || null,
        videoFile: p.videoFile || null,
        sku: p.sku || null,
        stock: p.stock ?? null,
        minOrder: p.minOrder ?? null,
        isActive: p.isActive ?? true,
        isFeatured: p.isFeatured ?? false,
        categoryId: p.categoryId,
        category: cat ? { id: cat.id, name: cat.name } : null,
        createdAt: p.created,
      };
    });

    return NextResponse.json(mapped);
  } catch (error) {
    console.error('Admin products fetch error:', error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const token = await getAdminToken();
    const body = await req.json();
    const storeId = (session.user as any).storeId;

    const res = await fetch(`${PB_URL()}/api/collections/products/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        categoryId: body.categoryId,
        description: body.description || "",
        price: parseFloat(body.price) || 0,
        originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
        image: body.image || null,
        imageUrl: body.image || null,
        images: body.images || [],
        galleryUrls: body.galleryUrls || [],
        videoUrl: body.videoUrl || null,
        videoFile: body.videoFile || null,
        sku: body.sku || null,
        stock: body.stock ? parseInt(body.stock) : null,
        minOrder: body.minOrder ? parseInt(body.minOrder) : null,
        isActive: body.isActive ?? true,
        isFeatured: body.isFeatured ?? false,
        storeId: storeId,
      }),
    });
    if (!res.ok) throw new Error('Failed to create product');
    const product = await res.json();
    return NextResponse.json(product);
  } catch (error) {
    console.error('Admin product create error:', error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
