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
import { utapi } from './upload.js';
import { HTTPException } from 'hono/http-exception';
import { eq } from 'drizzle-orm';

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
                pieceFootprint: true,
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
          pieceFootprint: cached.pieceFootprint,
        });
      } else {
        const {
          paths: { horizontal: horizontalPaths, vertical: verticalPaths },
          pieceFootprint,
        } = gameBuilderService.pathGenerator({
          origin: gameData.origin,
          pieceSize: gameData.pieceSize,
          cols: gameData.columns,
          rows: gameData.rows,
        });

        await db.insert(games).values({
          ...gameData,
          horizontalPaths,
          verticalPaths,
          pieceFootprint,
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

      const pathsData = gameBuilderService.pathGenerator({
        origin,
        pieceSize,
        cols,
        rows,
      });

      return c.json({ success: true, data: pathsData });
    }
  )
  .post('/builder/:gameId/pieces', async (c) => {
    const gameId = c.req.param('gameId');

    // Get the game from the database
    const [game] = await db
      .select()
      .from(games)
      .where(eq(games.id, Number(gameId)));

    if (!game) {
      throw new HTTPException(404, { message: 'Game not found' });
    }

    // Get the image from uploadthing
    const { ufsUrl } = await utapi.generateSignedURL(game.imageKey);

    // Fetch the image
    const imageResponse = await fetch(ufsUrl);

    // If the image is not found, throw an error
    if (!imageResponse.ok) {
      throw new HTTPException(404, { message: 'Image not found' });
    }

    // Convert the image to a buffer
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    const piecesData = gameBuilderService.createPieces({
      horizontalPaths: game.horizontalPaths,
      verticalPaths: game.verticalPaths,
    });

    // Cut the image into pieces
    const pieces = await gameBuilderService.cutImageIntoPieces({
      pieceFootprint: game.pieceFootprint,
      imageBuffer: Buffer.from(imageBuffer),
      ...piecesData,
    });

    return c.json({
      success: true,
      pieces,
      svg: piecesData.enclosedShapesSvg,
    });
  });
