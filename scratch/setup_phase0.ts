import 'dotenv/config';
import PocketBase from 'pocketbase';

/**
 * Phase 0: Setup notes collection + new fields/collections
 */
async function main() {
  const pb = new PocketBase(process.env.POCKETBASE_URL);
  await pb.admins.authWithPassword(
    process.env.POCKETBASE_ADMIN_EMAIL!,
    process.env.POCKETBASE_ADMIN_PASSWORD!
  );
  console.log('Authenticated\n');

  // 1. Create setup_notes collection (always visible in admin UI)
  try {
    await pb.collections.create({
      name: 'setup_notes',
      type: 'base',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'content', type: 'text', required: true },
        { name: 'category', type: 'text' },
        { name: 'sortOrder', type: 'number' },
      ],
      listRule: '',
      viewRule: '',
      createRule: '@request.auth.role = "admin"',
      updateRule: '@request.auth.role = "admin"',
      deleteRule: '@request.auth.role = "admin"',
    } as any);
    console.log('Created setup_notes collection');
  } catch (e: any) {
    // Might exist already from previous run
    try { await pb.collections.getOne('setup_notes'); console.log('setup_notes already exists'); }
    catch { console.error('Failed to create setup_notes:', e.message); }
  }

  // Seed notes
  const notes = [
    {
      title: '🔐 ADMIN CREDENTIALS — JANGAN DISHARE',
      content: [
        'PocketBase Admin UI: http://43.157.197.145:8090/_/',
        'Super Admin Email: surosantosoa@gmail.com',
        'Super Admin Password: GoT31i333@',
        '',
        '⚠️ Ganti password super admin secara berkala!',
        '⚠️ Jangan pernah commit .env ke git!',
      ].join('\n'),
      category: 'security',
      sortOrder: 1,
    },
    {
      title: '🏪 MULTI-TENANT: Daftar Store',
      content: [
        'Setiap store punya data eksklusif — tidak bisa lihat store lain.',
        '',
        '| Store Slug       | Nama                  | Admin Email              | Password   |',
        '|------------------|-----------------------|--------------------------|------------|',
        '| nanathawidya     | Nanathawidya Official | admin@nanathawidya.com   | Admin@123  |',
        '| toko-2           | Toko 2                | admin@toko2.com          | Toko2@123  |',
        '| toko-3           | Toko 3                | admin@toko3.com          | Toko3@123  |',
        '| toko-4           | Toko 4                | admin@toko4.com          | Toko4@123  |',
        '| toko-5           | Toko 5                | admin@toko5.com          | Toko5@123  |',
      ].join('\n'),
      category: 'stores',
      sortOrder: 2,
    },
    {
      title: '📋 Cara Nambah Store Baru',
      content: [
        '1. Buka setup_multi_tenant.ts, tambah entry ke array STORES dan STORE_ADMINS',
        '2. Jalankan: npx tsx scratch/setup_multi_tenant.ts',
        '3. Script akan:',
        '   - Buat record store baru di collection stores',
        '   - Buat user baru dengan role store_admin + storeId',
        '4. Copy kredensial user ke .env deployment toko baru:',
        '   POCKETBASE_STORE_SLUG=<slug>',
        '   POCKETBASE_STORE_EMAIL=<email>',
        '   POCKETBASE_STORE_PASSWORD=<password>',
        '5. Jalankan seed: npx tsx scratch/seed_store_data.ts',
      ].join('\n'),
      category: 'stores',
      sortOrder: 3,
    },
    {
      title: '🔒 API Rules — Keamanan Data',
      content: [
        'Semua collection data (categories, products, banners, settings, contactMessages)',
        'punya field storeId (relation ke stores). API rules memastikan isolasi:',
        '',
        'PUBLIC READ (tanpa auth): categories, products, banners, settings',
        '  → Tapi harus difilter by storeId dari server-side app',
        '',
        'PUBLIC WRITE (tanpa auth): contactMessages.create',
        '',
        'AUTH REQUIRED (store_admin):',
        '  → Create/Update/Delete di categories, products, banners, settings',
        '  → List/View/Update/Delete di contactMessages',
        '  → Rules: @request.auth.storeId = storeId',
        '',
        'ADMIN ONLY: stores, users',
        '  → Hanya super admin (role="admin") yang bisa manage',
        '',
        'Login cuma untuk role "admin" dan "store_admin"',
      ].join('\n'),
      category: 'security',
      sortOrder: 4,
    },
    {
      title: '📁 Struktur Collection',
      content: [
        'stores           → Master data toko',
        'users (auth)     → User login (admin, store_admin, customer) + storeId',
        'categories       → Kategori produk + storeId',
        'products         → Produk + storeId + originalPrice + videoUrl + videoFile',
        'banners          → Banner promosi + storeId',
        'settings         → Key-value settings + storeId',
        'contactMessages  → Pesan dari customer + storeId',
        'variants         → Varian produk (ukuran, warna, dll) + storeId',
        'orders           → Pesanan dari customer + storeId',
        'orderLogs        → Tracking perubahan status order + storeId',
        'setup_notes      → Dokumentasi ini',
      ].join('\n'),
      category: 'database',
      sortOrder: 5,
    },
    {
      title: '⚙️ Per-deployment .env Config',
      content: [
        '# Wajib di setiap deployment toko:',
        'POCKETBASE_URL=http://43.157.197.145:8090',
        'POCKETBASE_STORE_SLUG=nanathawidya   # ganti per toko',
        'POCKETBASE_STORE_EMAIL=admin@nanathawidya.com',
        'POCKETBASE_STORE_PASSWORD=Admin@123',
        '',
        '# Hanya untuk super admin (jangan di deployment toko):',
        'POCKETBASE_ADMIN_EMAIL=surosantosoa@gmail.com',
        'POCKETBASE_ADMIN_PASSWORD=GoT31i333@',
      ].join('\n'),
      category: 'deployment',
      sortOrder: 6,
    },
    {
      title: '🔄 Cara Seed Data Per Store',
      content: [
        'Setelah setup .env dengan kredensial store:',
        '',
        '  npx tsx scratch/seed_store_data.ts',
        '',
        'Script akan membuat:',
        '  - 3 kategori default',
        '  - 5 produk contoh',
        '  - Setting WA phone',
        '',
        'Untuk seed custom: edit scratch/seed_store_data.ts',
      ].join('\n'),
      category: 'deployment',
      sortOrder: 7,
    },
  ];

  for (const note of notes) {
    try {
      await pb.collection('setup_notes').create(note);
      console.log(`  Note: ${note.title.substring(0, 50)}`);
    } catch {
      console.log(`  Note exists (skipped): ${note.title.substring(0, 50)}`);
    }
  }

  // =============================================
  // NEW: Add fields to products collection
  // =============================================
  console.log('\n--- Updating products collection ---');
  try {
    const productsColl = await pb.collections.getOne('products');
    const existingFieldNames = productsColl.fields.map((f: any) => f.name);

    if (!existingFieldNames.includes('originalPrice')) {
      productsColl.fields.push({
        name: 'originalPrice', type: 'number',
      });
    }
    if (!existingFieldNames.includes('videoUrl')) {
      productsColl.fields.push({
        name: 'videoUrl', type: 'text',
      });
    }
    if (!existingFieldNames.includes('videoFile')) {
      productsColl.fields.push({
        name: 'videoFile', type: 'text',
      });
    }
    if (!existingFieldNames.includes('sku')) {
      productsColl.fields.push({
        name: 'sku', type: 'text',
      });
    }
    if (!existingFieldNames.includes('stock')) {
      productsColl.fields.push({
        name: 'stock', type: 'number',
      });
    }
    if (!existingFieldNames.includes('minOrder')) {
      productsColl.fields.push({
        name: 'minOrder', type: 'number',
      });
    }

    await pb.collections.update('products', productsColl as any);
    console.log('Updated products collection with new fields');
  } catch (e: any) {
    console.error('Error updating products:', e.message);
  }

  // =============================================
  // NEW: Create variants collection
  // =============================================
  console.log('\n--- Creating variants collection ---');
  try {
    const productsColl = await pb.collections.getOne('products');
    const storesColl = await pb.collections.getOne('stores');

    await pb.collections.create({
      name: 'variants',
      type: 'base',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
        { name: 'additionalPrice', type: 'number' },
        { name: 'stock', type: 'number' },
        { name: 'productId', type: 'relation', collectionId: productsColl.id, maxSelect: 1, required: true },
        { name: 'storeId', type: 'relation', collectionId: storesColl.id, maxSelect: 1, required: true },
      ],
      listRule: '',
      viewRule: '',
      createRule: '@request.auth.storeId != "" && @request.auth.storeId = storeId',
      updateRule: '@request.auth.storeId != "" && @request.auth.storeId = storeId',
      deleteRule: '@request.auth.storeId != "" && @request.auth.storeId = storeId',
    } as any);
    console.log('Created variants collection');
  } catch (e: any) {
    try { await pb.collections.getOne('variants'); console.log('variants already exists'); }
    catch { console.error('Failed to create variants:', e.message); }
  }

  // =============================================
  // NEW: Create orders collection
  // =============================================
  console.log('\n--- Creating orders collection ---');
  try {
    const storesColl = await pb.collections.getOne('stores');

    await pb.collections.create({
      name: 'orders',
      type: 'base',
      fields: [
        { name: 'invoiceNumber', type: 'text', required: true, unique: true },
        { name: 'customerName', type: 'text' },
        { name: 'customerPhone', type: 'text' },
        { name: 'customerEmail', type: 'email' },
        { name: 'customerAddress', type: 'text' },
        { name: 'items', type: 'json', required: true },
        { name: 'totalAmount', type: 'number', required: true },
        { name: 'status', type: 'text' },
        { name: 'notes', type: 'text' },
        { name: 'whatsappSent', type: 'bool' },
        { name: 'storeId', type: 'relation', collectionId: storesColl.id, maxSelect: 1, required: true },
      ],
      listRule: '@request.auth.storeId != "" && @request.auth.storeId = storeId',
      viewRule: '@request.auth.storeId != "" && @request.auth.storeId = storeId',
      createRule: '',
      updateRule: '@request.auth.storeId != "" && @request.auth.storeId = storeId',
      deleteRule: '@request.auth.role = "admin"',
    } as any);
    console.log('Created orders collection (public create, auth read)');
  } catch (e: any) {
    try { await pb.collections.getOne('orders'); console.log('orders already exists'); }
    catch { console.error('Failed to create orders:', e.message); }
  }

  // =============================================
  // NEW: Create orderLogs collection
  // =============================================
  console.log('\n--- Creating orderLogs collection ---');
  try {
    const ordersColl = await pb.collections.getOne('orders');
    const storesColl = await pb.collections.getOne('stores');

    await pb.collections.create({
      name: 'orderLogs',
      type: 'base',
      fields: [
        { name: 'orderId', type: 'relation', collectionId: ordersColl.id, maxSelect: 1, required: true },
        { name: 'fromStatus', type: 'text' },
        { name: 'toStatus', type: 'text', required: true },
        { name: 'note', type: 'text' },
        { name: 'userId', type: 'text' },
        { name: 'storeId', type: 'relation', collectionId: storesColl.id, maxSelect: 1, required: true },
      ],
      listRule: '@request.auth.storeId != "" && @request.auth.storeId = storeId',
      viewRule: '@request.auth.storeId != "" && @request.auth.storeId = storeId',
      createRule: '@request.auth.storeId != "" && @request.auth.storeId = storeId',
      updateRule: '@request.auth.role = "admin"',
      deleteRule: '@request.auth.role = "admin"',
    } as any);
    console.log('Created orderLogs collection');
  } catch (e: any) {
    try { await pb.collections.getOne('orderLogs'); console.log('orderLogs already exists'); }
    catch { console.error('Failed to create orderLogs:', e.message); }
  }

  console.log('\n=== Phase 0 Complete ===');
}

main().catch(console.error);
