import { zValidator } from '@hono/zod-validator';
import {
  coordinateSchema,
  gameSchema,
  jigsawBuilderFormSchema,
} from '@jigsaw/shared/schemas.js';
import { Hono } from 'hono';
import { db } from 'src/db/db.js';
import { games } from 'src/db/schema.js';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth-middleware.js';
import * as gameBuilderService from '../service/game-builder.js';

const basicGameCreateSchema = jigsawBuilderFormSchema.merge(
  gameSchema
    .pick({
      imageKey: true,
      pieceSize: true,
      rows: true,
      columns: true,
    })
    .extend({
      origin: coordinateSchema,
    })
);

export const gameRoute = new Hono()
  .use(authMiddleware)
  .post(
    '/builder',
    zValidator(
      'json',
      basicGameCreateSchema
        // merge with cached. If the client has a cached game, it will be merged with the new game data. (Preview button)
        .merge(
          z.object({
            cached: gameSchema
              .pick({
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
      const { cached, ...gameData } = c.req.valid('json');

      // If Cached, use that info from the client to avoid rebuilding paths
      if (cached) {
        await db.insert(games).values({
          ...gameData,
          horizontalPaths: cached.horizontalPaths,
          verticalPaths: cached.verticalPaths,
        });
      } else {
        const paths = gameBuilderService.pathGenerator({
          origin: gameData.origin,
          pieceSize: gameData.pieceSize,
          cols: gameData.columns,
          rows: gameData.rows,
        });

        await db.insert(games).values({
          ...gameData,
          horizontalPaths: paths.horizontal,
          verticalPaths: paths.vertical,
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

      const paths = gameBuilderService.pathGenerator({
        origin,
        pieceSize,
        cols,
        rows,
      });

      return c.json({ success: true, data: paths });
    }
  );
