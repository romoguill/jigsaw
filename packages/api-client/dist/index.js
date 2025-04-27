import { hc } from 'hono/client';
// Recommended by Hono. Build the client to have the types generated.
const client = hc('');
export const hcWithType = (...args) => hc(...args);
