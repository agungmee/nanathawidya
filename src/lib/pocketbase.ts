import PocketBase from 'pocketbase';

const globalForPB = globalThis as unknown as {
  pb: PocketBase | undefined;
  storeClients: Record<string, PocketBase> | undefined;
};

export function createPocketBaseClient() {
  const url = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
  const pb = new PocketBase(url);
  pb.autoCancellation(false);
  return pb;
}

export const pb = globalForPB.pb ?? createPocketBaseClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPB.pb = pb;
}

export async function getAdminClient() {
  const adminPB = createPocketBaseClient();
  const email = process.env.POCKETBASE_ADMIN_EMAIL;
  const password = process.env.POCKETBASE_ADMIN_PASSWORD;

  if (email && password) {
    try {
      await adminPB.admins.authWithPassword(email, password);
    } catch (error) {
      console.error('PocketBase Admin Auth failed:', error);
    }
  }

  return adminPB;
}

export async function getStoreClient(storeEmail?: string, storePassword?: string) {
  const email = storeEmail || process.env.POCKETBASE_STORE_EMAIL;
  const password = storePassword || process.env.POCKETBASE_STORE_PASSWORD;

  if (!email || !password) {
    console.warn('POCKETBASE_STORE_EMAIL/PASSWORD not set, falling back to unauthenticated client');
    return createPocketBaseClient();
  }

  const cacheKey = `${email}`;
  if (globalForPB.storeClients?.[cacheKey]) {
    return globalForPB.storeClients[cacheKey];
  }

  const client = createPocketBaseClient();
  try {
    await client.collection('users').authWithPassword(email, password);
  } catch (error) {
    console.error('Store auth failed:', error);
  }

  if (typeof globalForPB.storeClients === 'undefined') {
    globalForPB.storeClients = {};
  }
  if (process.env.NODE_ENV !== 'production') {
    globalForPB.storeClients[cacheKey] = client;
  }

  return client;
}

export function getStoreSlug(): string {
  return process.env.POCKETBASE_STORE_SLUG || 'nanathawidya';
}

let resolvedStoreId: string | null = null;

export async function resolveStoreId(): Promise<string> {
  if (resolvedStoreId) return resolvedStoreId;

  const slug = getStoreSlug();
  try {
    const store = await pb.collection('stores').getFirstListItem(`slug="${slug}"`);
    resolvedStoreId = store.id;
    return store.id;
  } catch {
    // Fallback: try admin client
    try {
      const adminPb = await getAdminClient();
      const store = await adminPb.collection('stores').getFirstListItem(`slug="${slug}"`);
      resolvedStoreId = store.id;
      return store.id;
    } catch {
      return '';
    }
  }
}

export function resetStoreIdCache() {
  resolvedStoreId = null;
}

export function buildStoreFilter(storeId: string, extraFilter?: string): string {
  const base = `storeId = "${storeId}"`;
  return extraFilter ? `${base} && ${extraFilter}` : base;
}
