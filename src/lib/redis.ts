import { kv } from '@vercel/kv';

export async function getCachedData(key: string) {
  return await kv.get(key);
}

export async function setCachedData(key: string, value: any, expirationInSeconds: number) {
  await kv.set(key, value, { ex: expirationInSeconds });
}

export async function deleteCachedData(key: string) {
  await kv.del(key);
}