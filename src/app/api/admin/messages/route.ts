import { NextResponse } from "next/server";
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
    const qs = filter ? `filter=${encodeURIComponent(filter)}` : '';
    const res = await fetch(`${PB_URL()}/api/collections/contactMessages/records?${qs}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch messages');
    const data = await res.json();
    return NextResponse.json(data.items || []);
  } catch {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
