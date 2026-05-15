import 'dotenv/config';
import { getAdminClient } from '../src/lib/pocketbase.ts';

async function seedSettings() {
  const pb = await getAdminClient();
  
  try {
    await pb.collection('settings').create({
      key: 'wa_phone',
      value: '6282139742007'
    });
    console.log('Seeded wa_phone setting');
  } catch (e) {
    console.log('wa_phone setting might already exist');
  }
}

seedSettings();
