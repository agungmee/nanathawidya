import 'dotenv/config';
import PocketBase from 'pocketbase';

async function main() {
  const storeSlug = process.env.POCKETBASE_STORE_SLUG || 'nanathawidya';
  const storeEmail = process.env.POCKETBASE_STORE_EMAIL || 'admin@nanathawidya.com';
  const storePassword = process.env.POCKETBASE_STORE_PASSWORD || 'Admin@123';

  const pb = new PocketBase(process.env.POCKETBASE_URL);

  // Auth as store admin
  await pb.collection('users').authWithPassword(storeEmail, storePassword);
  const authUser = pb.authStore.record;
  const storeId = authUser?.storeId;

  if (!storeId) {
    console.error('No storeId found for this user');
    process.exit(1);
  }

  console.log(`Seeding data for store: ${storeSlug} (${storeId})`);

  // Seed categories
  const categories = [
    { name: 'Karung PP Woven', slug: 'karung-pp-woven', description: 'Karung plastik anyam (woven) berkualitas tinggi untuk berbagai kebutuhan industri dan pertanian.', storeId },
    { name: 'Karung Laminasi', slug: 'karung-laminasi', description: 'Karung plastik dengan lapisan laminasi untuk perlindungan ekstra.', storeId },
    { name: 'Plastik Packing Custom', slug: 'plastik-packing-custom', description: 'Plastik kemasan custom sesuai kebutuhan bisnis Anda.', storeId },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    try {
      const existing = await pb.collection('categories').getFirstListItem(`slug="${cat.slug}"`);
      createdCategories[cat.slug] = existing.id;
      console.log(`  Category exists: ${cat.name}`);
    } catch {
      const c = await pb.collection('categories').create(cat);
      createdCategories[cat.slug] = c.id;
      console.log(`  Created category: ${cat.name}`);
    }
  }

  // Seed products
  const products = [
    { name: 'Karung PP Woven 50kg', slug: 'karung-pp-woven-50kg', price: 5000, categoryId: createdCategories['karung-pp-woven'], description: 'Karung PP woven ukuran 50kg, kuat dan tahan lama.', isActive: true, isFeatured: true, storeId },
    { name: 'Karung PP Woven 25kg', slug: 'karung-pp-woven-25kg', price: 3500, categoryId: createdCategories['karung-pp-woven'], description: 'Karung PP woven ukuran 25kg, cocok untuk kemasan kecil.', isActive: true, isFeatured: false, storeId },
    { name: 'Karung Laminasi 50kg', slug: 'karung-laminasi-50kg', price: 7500, categoryId: createdCategories['karung-laminasi'], description: 'Karung laminasi ukuran 50kg dengan lapisan pelindung.', isActive: true, isFeatured: true, storeId },
    { name: 'Karung Laminasi 25kg', slug: 'karung-laminasi-25kg', price: 5500, categoryId: createdCategories['karung-laminasi'], description: 'Karung laminasi ukuran 25kg.', isActive: true, isFeatured: false, storeId },
    { name: 'Standing Pouch Custom', slug: 'standing-pouch-custom', price: 2500, categoryId: createdCategories['plastik-packing-custom'], description: 'Standing pouch ziplock custom dengan cetak brand sendiri.', isActive: true, isFeatured: true, storeId },
  ];

  for (const prod of products) {
    try {
      const existing = await pb.collection('products').getFirstListItem(`slug="${prod.slug}"`);
      console.log(`  Product exists: ${prod.name}`);
    } catch {
      await pb.collection('products').create(prod);
      console.log(`  Created product: ${prod.name}`);
    }
  }

  // Seed WA setting
  try {
    const existing = await pb.collection('settings').getFirstListItem(`key="wa_phone"`);
    console.log('  WA setting exists');
  } catch {
    await pb.collection('settings').create({
      key: 'wa_phone',
      value: '6282139742007',
      storeId,
    });
    console.log('  Created WA setting');
  }

  console.log(`\nSeed complete for ${storeSlug}`);
}

main().catch(console.error);
