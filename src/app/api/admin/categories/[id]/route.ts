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
      const checkRes = await fetch(`${PB_URL()}/api/collections/categories/records/${params.id}`, {
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
    if (body.description !== undefined) data.description = body.description;
    if (body.image !== undefined) data.image = body.image;

    const res = await fetch(`${PB_URL()}/api/collections/categories/records/${params.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update');
    const category = await res.json();
    return NextResponse.json(category);
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
      const checkRes = await fetch(`${PB_URL()}/api/collections/categories/records/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (checkRes.ok) {
        const existing = await checkRes.json();
        if (existing.storeId !== storeId) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }
    }

    const prodParams = new URLSearchParams({ filter: `categoryId = "${params.id}"`, fields: 'id' });
    const prodRes = await fetch(`${PB_URL()}/api/collections/products/records?${prodParams}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (prodRes.ok) {
      const prodData = await prodRes.json();
      const products = prodData.items || [];
      if (products.length > 0) {
        return NextResponse.json({
          error: `Kategori ini memiliki ${products.length} produk. Pindahkan atau hapus produk terlebih dahulu.`,
        }, { status: 400 });
      }
    }

    const res = await fetch(`${PB_URL()}/api/collections/categories/records/${params.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to delete');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
