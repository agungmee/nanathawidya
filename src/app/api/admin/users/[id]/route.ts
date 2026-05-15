import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/pocketbase";
import { auth } from "@/lib/auth";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const pb = await getAdminClient();
    await pb.collection('users').delete(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
