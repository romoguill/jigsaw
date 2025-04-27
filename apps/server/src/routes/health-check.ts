import { Hono } from 'hono';

export const healthCheckRoute = new Hono().get('/', (c) =>
  c.json({ status: 'OK' })
);
