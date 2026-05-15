import 'dotenv/config';
import { getAdminClient } from '../src/lib/pocketbase.ts';

async function checkCollections() {
  try {
    const pb = await getAdminClient();
    const collections = await pb.collections.getFullList();
    console.log('Collections:', collections.map(c => c.name));
  } catch (error) {
    console.error('Error fetching collections:', error);
  }
}

checkCollections();
