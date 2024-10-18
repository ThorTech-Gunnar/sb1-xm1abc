import { get } from '@vercel/edge-config';

export async function getConfig(key: string) {
  return await get(key);
}