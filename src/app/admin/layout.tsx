import { AdminShell } from "./admin-shell";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin Panel | PT. Nirwasita Athawidya Nusantara",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
