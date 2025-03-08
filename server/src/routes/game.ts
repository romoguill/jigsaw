import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { jigsawBuilderFormSchema } from '../../shared/types.js';
import { authMiddleware } from '../middleware/auth-middleware.js';
import * as builderService from '../services/game-builder.js';

export const gameRoute = new Hono()
  .use(authMiddleware)
  .post(
    '/builder',
    zValidator(
      'json',
      z.intersection(jigsawBuilderFormSchema, z.object({ imageId: z.string() }))
    ),
    (c) => {
      return c.json({ success: true });
    }
  )
  .get('/builder/path', (c) => {
    const path = builderService.createPath({
      origin: { x: 0, y: 0 },
      pieceQuantity: 1,
      pieceSize: 1000,
    });

    return c.json({ path });
  });
