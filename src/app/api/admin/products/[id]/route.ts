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

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const token = await getAdminToken();
    const role = (session.user as any).role;
    const storeId = (session.user as any).storeId;

    const res = await fetch(`${PB_URL()}/api/collections/products/records/${params.id}?expand=categoryId`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Not found');
    const product = await res.json();

    if (role !== 'admin' && storeId && product.storeId !== storeId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const cat = product.expand?.categoryId;
    return NextResponse.json({
      ...product,
      category: cat ? { id: cat.id, name: cat.name } : null,
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const token = await getAdminToken();
    const role = (session.user as any).role;
    const storeId = (session.user as any).storeId;

    if (role !== 'admin' && storeId) {
      const checkRes = await fetch(`${PB_URL()}/api/collections/products/records/${params.id}`, {
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
    if (body.name !== undefined) data.name = body.name;
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.categoryId !== undefined) data.categoryId = body.categoryId;
    if (body.description !== undefined) data.description = body.description;
    if (body.price !== undefined) data.price = parseFloat(body.price);
    if (body.originalPrice !== undefined) data.originalPrice = body.originalPrice ? parseFloat(body.originalPrice) : null;
    if (body.image !== undefined) data.image = body.image;
    if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl;
    if (body.images !== undefined) data.images = body.images;
    if (body.galleryUrls !== undefined) data.galleryUrls = body.galleryUrls;
    if (body.videoUrl !== undefined) data.videoUrl = body.videoUrl;
    if (body.videoFile !== undefined) data.videoFile = body.videoFile;
    if (body.sku !== undefined) data.sku = body.sku;
    if (body.stock !== undefined) data.stock = body.stock ? parseInt(body.stock) : null;
    if (body.minOrder !== undefined) data.minOrder = body.minOrder ? parseInt(body.minOrder) : null;
    if (body.isActive !== undefined) data.isActive = body.isActive;
    if (body.isFeatured !== undefined) data.isFeatured = body.isFeatured;

    const res = await fetch(`${PB_URL()}/api/collections/products/records/${params.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update');
    const product = await res.json();
    return NextResponse.json(product);
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
      const checkRes = await fetch(`${PB_URL()}/api/collections/products/records/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (checkRes.ok) {
        const existing = await checkRes.json();
        if (existing.storeId !== storeId) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }
    }

    const res = await fetch(`${PB_URL()}/api/collections/products/records/${params.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to delete');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
