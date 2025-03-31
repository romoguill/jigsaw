import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { Hono } from 'hono';
import { Path } from '../core/path.js';
import { authMiddleware } from '../middleware/auth-middleware.js';
import {
  coordinateSchema,
  gameSchema,
  jigsawBuilderFormSchema,
} from '@jigsaw/shared/schemas.js';
import { db } from 'src/db/db.js';
import { games } from 'src/db/schema.js';
import { calculatePinSize } from '../lib/utils.js';

const basicGameSchema = jigsawBuilderFormSchema.merge(
  gameSchema.pick({
    imageKey: true,
    pieceSize: true,
    rows: true,
    columns: true,
  })
);

export const gameRoute = new Hono()
  .use(authMiddleware)
  .post(
    '/builder',
    zValidator(
      'json',
      jigsawBuilderFormSchema
        // merge with imageKey. Mandatory for builder
        .merge(
          gameSchema.pick({
            imageKey: true,
          })
        )
        // merge with cached. If the client has a cached game, it will be merged with the new game data. (Preview button)
        .merge(
          z.object({
            cached: gameSchema
              .pick({
                rows: true,
                columns: true,
                pieceSize: true,
                horizontalPaths: true,
                verticalPaths: true,
              })
              .optional(),
          })
        )
        .transform((data) => ({
          ...data,
          pieceCount: Number(data.pieceCount),
        }))
    ),
    async (c) => {
      const { imageKey, borders, difficulty, pieceCount, cached } =
        c.req.valid('json');

      // If Cached, use that info from the client to avoid rebuilding paths
      if (cached) {
        const gameData = {
          pieceCount,
          horizontalPaths: cached.horizontalPaths,
          verticalPaths: cached.verticalPaths,
          pieceSize: cached.pieceSize,
          columns: cached.columns,
          rows: cached.rows,
        };

        await db.insert(games).values({
          ...gameData,
          imageKey,
          difficulty,
          pieceCount,
          hasBorders: borders,
        });
      }

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
        cols: z.number(),
        rows: z.number(),
      })
    ),
    (c) => {
      const { origin, pieceSize, cols, rows } = c.req.valid('json');

      const paths: { horizontal: string[]; vertical: string[] } = {
        horizontal: [],
        vertical: [],
      };

      const pinSize = calculatePinSize(pieceSize);

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
