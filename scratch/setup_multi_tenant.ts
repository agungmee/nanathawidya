import 'dotenv/config';
import PocketBase from 'pocketbase';

const STORES = [
  { name: 'Nanathawidya Official', slug: 'nanathawidya', domain: '', isActive: true },
  { name: 'Toko 2', slug: 'toko-2', domain: '', isActive: true },
  { name: 'Toko 3', slug: 'toko-3', domain: '', isActive: true },
  { name: 'Toko 4', slug: 'toko-4', domain: '', isActive: true },
  { name: 'Toko 5', slug: 'toko-5', domain: '', isActive: true },
];

const STORE_ADMINS = [
  { email: 'admin@nanathawidya.com', password: 'Admin@123', name: 'Admin Official' },
  { email: 'admin@toko2.com', password: 'Toko2@123', name: 'Admin Toko 2' },
  { email: 'admin@toko3.com', password: 'Toko3@123', name: 'Admin Toko 3' },
  { email: 'admin@toko4.com', password: 'Toko4@123', name: 'Admin Toko 4' },
  { email: 'admin@toko5.com', password: 'Toko5@123', name: 'Admin Toko 5' },
];

async function main() {
  console.log('=== PocketBase Multi-Tenant Setup (v0.38) ===\n');

  const pb = new PocketBase(process.env.POCKETBASE_URL);
  await pb.admins.authWithPassword(
    process.env.POCKETBASE_ADMIN_EMAIL!,
    process.env.POCKETBASE_ADMIN_PASSWORD!
  );
  console.log('Authenticated as admin\n');

  // 1. Create STORES collection
  const storesColl = await pb.collections.create({
    name: 'stores',
    type: 'base',
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'slug', type: 'text', required: true, unique: true },
      { name: 'domain', type: 'text' },
      { name: 'isActive', type: 'bool' },
      { name: 'logo', type: 'text' },
      { name: 'description', type: 'text' },
      { name: 'contactEmail', type: 'email' },
      { name: 'contactPhone', type: 'text' },
      { name: 'address', type: 'json' },
      { name: 'theme', type: 'json' },
    ],
    listRule: '',
    viewRule: '',
    createRule: '@request.auth.role = "admin"',
    updateRule: '@request.auth.role = "admin"',
    deleteRule: '@request.auth.role = "admin"',
  } as any);
  console.log('Created stores collection');

  // 2. Seed stores
  const stores: any[] = [];
  for (const s of STORES) {
    const store = await pb.collection('stores').create(s);
    stores.push(store);
    console.log(`  Store: ${store.slug} (${store.id})`);
  }

  // 3. Update users collection
  const usersColl = await pb.collections.getOne('users');
  usersColl.fields.push({
    name: 'storeId',
    type: 'relation',
    collectionId: storesColl.id,
    maxSelect: 1,
    cascadeDelete: false,
  });
  usersColl.listRule = '@request.auth.role = "admin"';
  usersColl.viewRule = 'id = @request.auth.id || @request.auth.role = "admin"';
  usersColl.createRule = '@request.auth.role = "admin"';
  usersColl.updateRule = 'id = @request.auth.id || @request.auth.role = "admin"';
  usersColl.deleteRule = '@request.auth.role = "admin"';
  await pb.collections.update('users', usersColl as any);
  console.log('Updated users collection with storeId + API rules');

  // 4. Create data collections (categories, products, banners)
  const dataCollections = [
    {
      name: 'categories',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'image', type: 'text' },
        { name: 'description', type: 'text' },
        { name: 'storeId', type: 'relation', collectionId: storesColl.id, maxSelect: 1, required: true },
      ],
    },
    {
      name: 'products',
      fields: [
        { name: 'categoryId', type: 'relation', collectionId: null as any, maxSelect: 1, required: true },
        { name: 'name', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'description', type: 'text' },
        { name: 'price', type: 'number', required: true },
        { name: 'image', type: 'text' },
        { name: 'imageUrl', type: 'text' },
        { name: 'images', type: 'json' },
        { name: 'galleryUrls', type: 'json' },
        { name: 'isActive', type: 'bool' },
        { name: 'isFeatured', type: 'bool' },
        { name: 'storeId', type: 'relation', collectionId: storesColl.id, maxSelect: 1, required: true },
      ],
    },
    {
      name: 'banners',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'subtitle', type: 'text' },
        { name: 'type', type: 'text' },
        { name: 'image', type: 'text' },
        { name: 'url', type: 'text' },
        { name: 'isActive', type: 'bool' },
        { name: 'sortOrder', type: 'number' },
        { name: 'storeId', type: 'relation', collectionId: storesColl.id, maxSelect: 1, required: true },
      ],
    },
  ];

  // We need to create categories first so products can reference it
  const createdColls: Record<string, any> = {};

  for (const def of dataCollections) {
    // Resolve categoryId relation for products
    if (def.name === 'products') {
      def.fields[0] = {
        name: 'categoryId',
        type: 'relation',
        collectionId: createdColls['categories'].id,
        maxSelect: 1,
        required: true,
      };
    }

    const coll = await pb.collections.create({
      name: def.name,
      type: 'base',
      fields: def.fields,
      listRule: '',
      viewRule: '',
      createRule: '@request.auth.storeId != "" && @request.auth.storeId = storeId',
      updateRule: '@request.auth.storeId != "" && @request.auth.storeId = storeId',
      deleteRule: '@request.auth.storeId != "" && @request.auth.storeId = storeId',
    } as any);
    createdColls[def.name] = coll;
    console.log(`Created ${def.name} collection`);
  }

  // 5. Create settings collection (protected - needs auth)
  const settingsColl = await pb.collections.create({
    name: 'settings',
    type: 'base',
    fields: [
      { name: 'key', type: 'text', required: true },
      { name: 'value', type: 'json' },
      { name: 'storeId', type: 'relation', collectionId: storesColl.id, maxSelect: 1, required: true },
    ],
    listRule: '@request.auth.storeId != "" && @request.auth.storeId = storeId',
    viewRule: '@request.auth.storeId != "" && @request.auth.storeId = storeId',
    createRule: '@request.auth.storeId != "" && @request.auth.storeId = storeId',
    updateRule: '@request.auth.storeId != "" && @request.auth.storeId = storeId',
    deleteRule: '@request.auth.storeId != "" && @request.auth.storeId = storeId',
  } as any);
  console.log('Created settings collection');

  // 6. Create contactMessages (public create)
  const contactColl = await pb.collections.create({
    name: 'contactMessages',
    type: 'base',
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'email', type: 'email', required: true },
      { name: 'phone', type: 'text' },
      { name: 'subject', type: 'text' },
      { name: 'message', type: 'text', required: true },
      { name: 'isRead', type: 'bool' },
      { name: 'storeId', type: 'relation', collectionId: storesColl.id, maxSelect: 1, required: true },
    ],
    listRule: '@request.auth.storeId != "" && @request.auth.storeId = storeId',
    viewRule: '@request.auth.storeId != "" && @request.auth.storeId = storeId',
    createRule: '',
    updateRule: '@request.auth.storeId != "" && @request.auth.storeId = storeId',
    deleteRule: '@request.auth.storeId != "" && @request.auth.storeId = storeId',
  } as any);
  console.log('Created contactMessages collection');

  // 7. Create store admin users
  for (let i = 0; i < stores.length; i++) {
    const store = stores[i];
    const adminInfo = STORE_ADMINS[i];
    if (!adminInfo) continue;

    await pb.collection('users').create({
      email: adminInfo.email,
      password: adminInfo.password,
      passwordConfirm: adminInfo.password,
      name: adminInfo.name,
      role: 'store_admin',
      storeId: store.id,
    });
    console.log(`Created user ${adminInfo.email} for ${store.slug}`);
  }

  // 8. Seed default settings for first store
  await pb.collection('settings').create({
    key: 'wa_phone',
    value: '6282139742007',
    storeId: stores[0].id,
  });
  console.log('Seeded default settings for nanathawidya');

  // 9. Output summary
  console.log('\n=== Multi-Tenant Setup Complete ===\n');
  console.log('Stores:');
  for (const s of stores) {
    console.log(`  ${s.slug} -> ${s.name}`);
  }
  console.log('\nStore Admin Credentials:');
  for (let i = 0; i < stores.length; i++) {
    const s = stores[i];
    const a = STORE_ADMINS[i];
    if (s && a) {
      console.log(`  ${s.slug}: ${a.email} / ${a.password}`);
    }
  }
  console.log('\nPer-deployment .env config:');
  console.log('---');
  console.log('POCKETBASE_STORE_SLUG=nanathawidya  # change per deployment');
  console.log('POCKETBASE_STORE_EMAIL=admin@nanathawidya.com');
  console.log('POCKETBASE_STORE_PASSWORD=Admin@123');
  console.log('---');
}

main().catch(console.error);
