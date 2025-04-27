import type { UploadThingRouter } from '@jigsaw/server/uploadthing';
import type { ApiType } from '@jigsaw/server/routes';

import { hc } from 'hono/client';

// Recommended by Hono. Build the client to have the types generated.

const client = hc<ApiType>('');
export type Client = typeof client;

export const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<ApiType>(...args);

// Use for passing the router to client.
export type UploadRouter = UploadThingRouter;
