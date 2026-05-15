import 'dotenv/config';
import { getAdminClient } from '../src/lib/pocketbase.ts';

async function checkUsersCollection() {
  try {
    const pb = await getAdminClient();
    const usersCollection = await pb.collections.getOne('users');
    console.log('Users Fields:', usersCollection.fields.map(f => f.name));
  } catch (error) {
    console.error('Error fetching users collection:', error);
  }
}

checkUsersCollection();
