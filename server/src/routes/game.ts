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
        cols: z.number(),
        rows: z.number(),
      })
    ),
    (c) => {
      const { origin, pieceSize, pinSize, cols, rows } = c.req.valid('json');

      const paths: { horizontal: string[]; vertical: string[] } = {
        horizontal: [],
        vertical: [],
      };

      for (let i = 0; i < rows; i++) {
        const pathBuilder = new Path(origin, pieceSize, pinSize, cols);

        pathBuilder.generateCompletePath('complete');

        paths.horizontal.push(pathBuilder.toString());
      }

      for (let i = 0; i < cols; i++) {
        const pathBuilder = new Path(origin, pieceSize, pinSize, rows);

        pathBuilder.generateCompletePath('complete');

        paths.vertical.push(pathBuilder.toString());
      }

      return c.json({ success: true, data: paths });
    }
  );
