"use client";

import { useEffect, useState } from "react";
import { Search, Trash2, Plus, X } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", email: "", password: "", phone: "", role: "customer" });

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addForm),
    });
    if (res.ok) {
      setShowAdd(false);
      setAddForm({ name: "", email: "", password: "", phone: "", role: "customer" });
      fetchUsers();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus pengguna ini?")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) setUsers(users.filter((u) => u.id !== id));
  };

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-primary">Pengguna ({users.length})</h1>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-accent text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent-hover transition-all">
          <Plus size={16} /> Tambah Pengguna
        </button>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input type="text" placeholder="Cari pengguna..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-accent" />
      </div>

      {loading ? (
        <div className="text-center py-10 text-muted">Memuat...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-muted">Belum ada pengguna</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-3 font-semibold text-muted">Nama</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted hidden sm:table-cell">Email</th>
                  <th className="text-center px-4 py-3 font-semibold text-muted">Role</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted hidden md:table-cell">Bergabung</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-primary">{u.name || "Tanpa nama"}</p>
                        {u.phone && <p className="text-xs text-muted">{u.phone}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted hidden sm:table-cell">{u.email || "-"}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        u.role === "admin" ? "bg-purple-100 text-purple-600" :
                        u.role === "store_admin" ? "bg-blue-100 text-blue-600" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {u.role === "admin" ? "Admin" : u.role === "store_admin" ? "Store" : "Customer"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-muted text-xs hidden md:table-cell">
                      {new Date(u.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDelete(u.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
            <button onClick={() => setShowAdd(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            <h3 className="font-bold text-lg text-primary mb-4">Tambah Pengguna</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted block mb-1">Nama</label>
                <input required value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted block mb-1">Email *</label>
                <input required type="email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted block mb-1">Password *</label>
                <input required type="password" value={addForm.password} onChange={(e) => setAddForm({ ...addForm, password: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted block mb-1">Role</label>
                <select value={addForm.role} onChange={(e) => setAddForm({ ...addForm, role: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent">
                  <option value="customer">Customer</option>
                  <option value="store_admin">Store Admin</option>
                  <option value="admin">Super Admin</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-accent text-white font-semibold py-2.5 rounded-xl hover:bg-accent-hover transition-all">
                Simpan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
