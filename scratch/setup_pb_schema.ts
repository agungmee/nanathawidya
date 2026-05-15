import 'dotenv/config';
import { getAdminClient } from '../src/lib/pocketbase.ts';

async function setupSchema() {
  const pb = await getAdminClient();

  // 1. Update 'users' collection
  try {
    const users = await pb.collections.getOne('users');
    const existingFields = users.fields.map(f => f.name);
    
    if (!existingFields.includes('phone')) {
      users.fields.push({ name: 'phone', type: 'text' });
    }
    if (!existingFields.includes('role')) {
      users.fields.push({ name: 'role', type: 'text', options: { values: ['admin', 'customer'] } });
    }
    if (!existingFields.includes('address')) {
      users.fields.push({ name: 'address', type: 'json' });
    }
    if (!existingFields.includes('deletedAt')) {
      users.fields.push({ name: 'deletedAt', type: 'date' });
    }
    await pb.collections.update('users', users);
    console.log('Updated users collection');
  } catch (e) { console.error('Error updating users:', e); }

  // 2. Categories
  try {
    await pb.collections.create({
      name: 'categories',
      type: 'base',
      schema: [
        { name: 'name', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'image', type: 'text' },
        { name: 'description', type: 'text' },
      ],
    });
    console.log('Created categories collection');
  } catch (e) { console.log('categories might exist'); }

  // 3. Products
  try {
    await pb.collections.create({
      name: 'products',
      type: 'base',
      schema: [
        { name: 'categoryId', type: 'relation', options: { collectionId: 'categories', maxSelect: 1 }, required: true },
        { name: 'name', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'description', type: 'text' },
        { name: 'price', type: 'number', required: true },
        { name: 'image', type: 'text' },
        { name: 'imageUrl', type: 'text' },
        { name: 'images', type: 'json' },
        { name: 'galleryUrls', type: 'json' },
        { name: 'isActive', type: 'bool', options: { default: true } },
        { name: 'isFeatured', type: 'bool', options: { default: false } },
      ],
    });
    console.log('Created products collection');
  } catch (e) { console.log('products might exist'); }

  // 4. Banners
  try {
    await pb.collections.create({
      name: 'banners',
      type: 'base',
      schema: [
        { name: 'title', type: 'text' },
        { name: 'subtitle', type: 'text' },
        { name: 'type', type: 'text', options: { values: ['image', 'video'] } },
        { name: 'image', type: 'text' },
        { name: 'url', type: 'text' },
        { name: 'isActive', type: 'bool', options: { default: true } },
        { name: 'sortOrder', type: 'number', options: { default: 0 } },
      ],
    });
    console.log('Created banners collection');
  } catch (e) { console.log('banners might exist'); }

  // 5. Settings
  try {
    await pb.collections.create({
      name: 'settings',
      type: 'base',
      schema: [
        { name: 'key', type: 'text', required: true, unique: true },
        { name: 'value', type: 'json' },
      ],
    });
    console.log('Created settings collection');
  } catch (e) { console.log('settings might exist'); }

  // 6. Contact Messages
  try {
    await pb.collections.create({
      name: 'contactMessages',
      type: 'base',
      schema: [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'phone', type: 'text' },
        { name: 'subject', type: 'text' },
        { name: 'message', type: 'text', required: true },
        { name: 'isRead', type: 'bool', options: { default: false } },
      ],
    });
    console.log('Created contactMessages collection');
  } catch (e) { console.log('contactMessages might exist'); }
}

setupSchema();
