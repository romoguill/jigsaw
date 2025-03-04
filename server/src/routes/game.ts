import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth-middleware.js';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { difficulty, pieceCount } from '../../shared/types.js';

export const gameRoute = new Hono().use(authMiddleware).post(
  '/builder',
  zValidator(
    'json',
    z.object({
      imageId: z.string(),
      difficulty: z.enum(difficulty),
      availablePieceCount: z.enum(pieceCount).array(),
    })
  ),
  (c) => {
    const user = c.get('user');
    return c.json({ user });
  }
);
