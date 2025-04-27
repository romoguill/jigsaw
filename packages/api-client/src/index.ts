import type { ApiType } from '@jigsaw/server/routes';

import { hc } from 'hono/client';

// Recommended by Hono. Build the client to have the types generated.

const client = hc<ApiType>('');
export type Client = typeof client;

export const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<ApiType>(...args);
