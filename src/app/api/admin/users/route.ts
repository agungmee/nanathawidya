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

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const token = await getAdminToken();
    const storeId = (session.user as any).storeId;
    const role = (session.user as any).role;
    const isSuperAdmin = role === "admin";

    const filter = isSuperAdmin ? '' : `storeId = "${storeId}"`;
    const qs = filter ? `filter=${encodeURIComponent(filter)}&sort=-created` : 'sort=-created';

    const res = await fetch(`${PB_URL()}/api/collections/users/records?${qs}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });

    const data = await res.json();
    const mapped = (data.items || []).map((u: any) => ({
      id: u.id,
      name: u.name || null,
      email: u.email || null,
      phone: u.phone || null,
      role: u.role || "customer",
      createdAt: u.created,
    }));

    return NextResponse.json(mapped);
  } catch {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const token = await getAdminToken();
    const body = await req.json();
    const storeId = (session.user as any).storeId;

    const res = await fetch(`${PB_URL()}/api/collections/users/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
        passwordConfirm: body.password,
        name: body.name || "",
        phone: body.phone || null,
        role: body.role || "customer",
        storeId: storeId || null,
      }),
    });

    if (!res.ok) return NextResponse.json({ error: "Failed to create user" }, { status: 500 });

    const user = await res.json();
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.created,
    });
  } catch {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
