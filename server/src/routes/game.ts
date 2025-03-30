import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { Hono } from 'hono';
import { Path } from '../core/path.js';
import { authMiddleware } from '../middleware/auth-middleware.js';
import {
  coordinateSchema,
  jigsawBuilderFormSchema,
} from '@jigsaw/shared/schemas.js';
import { db } from 'src/db/db.js';
import { games } from 'src/db/schema.js';

export const gameRoute = new Hono()
  .use(authMiddleware)
  .post(
    '/builder',
    zValidator(
      'json',
      z
        .intersection(
          jigsawBuilderFormSchema,
          z.object({ imageKey: z.string() })
        )
        .transform((data) => ({
          ...data,
          pieceCount: Number(data.pieceCount),
        }))
    ),
    async (c) => {
      const { imageKey, borders, difficulty, pieceCount } = c.req.valid('json');

      await db.insert(games).values({
        imageKey,
        difficulty,
        pieceCount,
        hasBorders: borders,
        horizontalPaths: [],
        verticalPaths: [],
        columns: 0,
        pieceSize: 0,
        rows: 0,
      });
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

      // Generate horizontal paths
      for (let i = 0; i < rows; i++) {
        const pathBuilder = new Path(origin, pieceSize, pinSize, cols + 1);

        pathBuilder.generateCompletePath('complete');

        paths.horizontal.push(pathBuilder.toString());
      }

      // Generate vertical paths
      for (let i = 0; i < cols; i++) {
        const pathBuilder = new Path(origin, pieceSize, pinSize, rows + 1);

        pathBuilder.generateCompletePath('complete');

        paths.vertical.push(pathBuilder.toString());
      }

      return c.json({ success: true, data: paths });
    }
  );
