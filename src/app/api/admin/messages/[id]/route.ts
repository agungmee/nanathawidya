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
      const checkRes = await fetch(`${PB_URL()}/api/collections/contactMessages/records/${params.id}`, {
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
    const res = await fetch(`${PB_URL()}/api/collections/contactMessages/records/${params.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        isRead: body.isRead ?? true,
      }),
    });
    if (!res.ok) throw new Error('Failed to update');
    const message = await res.json();
    return NextResponse.json(message);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
