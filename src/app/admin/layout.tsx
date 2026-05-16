import type { Metadata } from "next";
import { AdminShell } from "./admin-shell";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { default: "Admin Panel | PT. Nirwasita Athawidya Nusantara", template: "%s | Admin Panel" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
