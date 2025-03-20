import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import {
  coordinateSchema,
  jigsawBuilderFormSchema,
  type Coordinate,
} from '../../shared/types.js';
import { authMiddleware } from '../middleware/auth-middleware.js';
import { Path } from '../core/path.js';

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
  .post(
    '/builder/path',
    zValidator(
      'json',
      z.object({
        origin: coordinateSchema,
        pieceSize: z.number(),
        pinSize: z.number(),
        pieceQuantity: z.number(),
      })
    ),
    (c) => {
      const { origin, pieceSize, pinSize, pieceQuantity } = c.req.valid('json');

      const paths: { horizontal: string[]; vertical: string[] } = {
        horizontal: [],
        vertical: [],
      };

      for (let i = 0; i < pieceQuantity; i++) {
        for (let j = 0; j <= 1; j++) {
          const pathBuilder = new Path(
            origin,
            pieceSize,
            pinSize,
            pieceQuantity
          );
          pathBuilder.generateCompletePath('complete');

          j === 0
            ? paths.horizontal.push(pathBuilder.toString())
            : paths.vertical.push(pathBuilder.toString());
        }
      }

      return c.json({ success: true, data: paths });
    }
  );
