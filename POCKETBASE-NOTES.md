# PocketBase Multi-Tenant Setup Notes

> Dokumentasi ini juga tersedia di PocketBase Admin UI → Collection `setup_notes`

---

## 🔐 Admin Access

| Info | Value |
|------|-------|
| Admin UI | http://43.157.197.145:8090/_/ |
| Super Admin Email | surosantosoa@gmail.com |
| Super Admin Password | GoT31i333@ |

> ⚠️ **Jangan commit .env ke git!** Password ada di `.env` (already in `.gitignore`).
> ⚠️ Ganti password super admin secara berkala.

---

## 🏪 Daftar Store (Multi-Tenant)

Setiap store punya data **eksklusif + terisolasi** — tidak bisa lihat/mengubah data store lain.

| Store Slug | Nama | Admin Email | Password |
|---|---|---|---|
| `nanathawidya` | Nanathawidya Official | admin@nanathawidya.com | Admin@123 |
| `toko-2` | Toko 2 | admin@toko2.com | Toko2@123 |
| `toko-3` | Toko 3 | admin@toko3.com | Toko3@123 |
| `toko-4` | Toko 4 | admin@toko4.com | Toko4@123 |
| `toko-5` | Toko 5 | admin@toko5.com | Toko5@123 |

### Cara login sebagai store admin

Gunakan kredensial di atas di halaman `/login` website masing-masing toko.
Store admin **hanya bisa CRUD data toko sendiri**.

---

## 📋 Cara Nambah Store Baru

1. Buka `scratch/setup_multi_tenant.ts`, tambah entry ke array `STORES` dan `STORE_ADMINS`
2. Jalankan:
   ```bash
   npx tsx scratch/setup_multi_tenant.ts
   ```
3. Script akan:
   - Buat record store baru di collection `stores`
   - Buat user baru dengan role `store_admin` + `storeId`
4. Copy kredensial user ke `.env` deployment toko baru:
   ```env
   POCKETBASE_STORE_SLUG=<slug>
   POCKETBASE_STORE_EMAIL=<email>
   POCKETBASE_STORE_PASSWORD=<password>
   ```
5. Jalankan seed data:
   ```bash
   npx tsx scratch/seed_store_data.ts
   ```

---

## 🔒 API Rules (Keamanan)

### Public Read (tanpa auth)
- `categories`, `products`, `banners`, `settings`
- Tapi harus difilter by `storeId` dari server-side app

### Public Write (tanpa auth)
- `contactMessages.create` — customer bisa kirim pesan
- `orders.create` — customer bisa buat order (checkout)

### Auth Required (store_admin)
- Create/Update/Delete di `categories`, `products`, `banners`, `settings`
- List/View/Update/Delete di `contactMessages`
- Rules: `@request.auth.storeId = storeId`

### Admin Only (super admin)
- `stores`, `users`, `setup_notes`
- Hanya role `"admin"` yang bisa manage

---

## 📁 Struktur Collection PocketBase

| Collection | Type | Key Fields |
|---|---|---|
| `stores` | base | name, slug (unique), domain, isActive |
| `users` | auth | email, password, role (admin/store_admin/customer), **storeId** |
| `categories` | base | name, slug, image, description, **storeId** |
| `products` | base | categoryId, name, slug, price, **originalPrice**, images, galleryUrls, **videoUrl**, **videoFile**, **sku**, **stock**, isActive, isFeatured, **storeId** |
| `banners` | base | title, subtitle, type, image, url, isActive, sortOrder, **storeId** |
| `settings` | base | key (unique), value (JSON), **storeId** |
| `contactMessages` | base | name, email, phone, subject, message, isRead, **storeId** |
| `variants` | base | name, value, additionalPrice, stock, productId, **storeId** |
| `orders` | base | invoiceNumber, customerName, customerPhone, items (JSON), totalAmount, status, **storeId** |
| `orderLogs` | base | orderId, fromStatus, toStatus, note, **storeId** |
| `setup_notes` | base | title, content, category — **dokumentasi ini** |

---

## ⚙️ Per-deployment .env Config

```env
# Wajib di setiap deployment toko:
POCKETBASE_URL=http://43.157.197.145:8090
POCKETBASE_STORE_SLUG=nanathawidya   # ganti per toko
POCKETBASE_STORE_EMAIL=admin@nanathawidya.com
POCKETBASE_STORE_PASSWORD=Admin@123

# Hanya untuk super admin (jangan di deployment toko):
POCKETBASE_ADMIN_EMAIL=surosantosoa@gmail.com
POCKETBASE_ADMIN_PASSWORD=GoT31i333@
```

---

## 🔄 Cara Seed Data Per Store

```bash
# Setelah setup .env dengan kredensial store:
npx tsx scratch/seed_store_data.ts
```

Script akan membuat:
- 3 kategori default (Karung PP Woven, Karung Laminasi, Plastik Packing Custom)
- 5 produk contoh
- Setting WA phone

Untuk seed custom: edit `scratch/seed_store_data.ts`

---

## 🛠 Script yang Tersedia

| Script | Fungsi |
|---|---|
| `scratch/setup_multi_tenant.ts` | Setup awal multi-tenant (stores + users + API rules) |
| `scratch/setup_phase0.ts` | Setup notes + collections baru (variants, orders, orderLogs) + fields baru |
| `scratch/seed_store_data.ts` | Seed data per-store |
