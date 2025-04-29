import { zValidator } from '@hono/zod-validator';
import {
  coordinateSchema,
  gameSchema,
  gameStateSchema,
  jigsawBuilderFormSchema,
} from '@jigsaw/shared';
import { and, eq, or } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { db } from '../db/db.js';
import {
  games,
  gameSession,
  pieces,
  uploadedImage,
  user,
} from '../db/schema.js';
import { getPublicUploadthingUrl } from '../lib/utils.js';
import {
  authMiddleware,
  type ContextWithAuth,
} from '../middleware/auth-middleware.js';
import * as gameBuilderService from '../service/game-builder.js';
import { utapi } from './upload.js';
import crypto from 'crypto';

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

export const gameRoute = new Hono<ContextWithAuth>()
  .use(authMiddleware)
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
      const userId = c.get('user').id;

      let game: typeof games.$inferInsert;
      // Create the game entity
      // If Cached, use that info from the client to avoid rebuilding paths
      if (cached) {
        [game] = await db
          .insert(games)
          .values({
            ...gameData,
            ownerId: userId,
            horizontalPaths: cached.horizontalPaths,
            verticalPaths: cached.verticalPaths,
            pieceFootprint: cached.pieceFootprint,
          })
          .returning();
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

        [game] = await db
          .insert(games)
          .values({
            ...gameData,
            ownerId: userId,
            horizontalPaths,
            verticalPaths,
            pieceFootprint,
          })
          .returning();
      }

      // Get the image from uploadthing
      const { ufsUrl } = await utapi.generateSignedURL(game.imageKey);

      // Fetch the image
      const imageResponse = await fetch(ufsUrl);

      // If the image is not found, throw an error
      if (!imageResponse.ok) {
        throw new HTTPException(404, { message: 'Image not found' });
      }

      // Create the pieces
      const piecesData = gameBuilderService.createPieces({
        horizontalPaths: game.horizontalPaths,
        verticalPaths: game.verticalPaths,
        pieceSize: game.pieceSize,
      });

      // Convert the image to a buffer
      const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

      // Cut the image into pieces
      const cutPieces = await gameBuilderService.cutImageIntoPieces({
        pieceFootprint: game.pieceFootprint,
        imageBuffer: Buffer.from(imageBuffer),
        ...piecesData,
      });

      // Upload the pieces to uploadthing
      const uploadResults = await utapi.uploadFiles(
        cutPieces.map((piece) => piece.file)
      );

      // Check that all pieces were uploaded successfully
      if (uploadResults.some((result) => result.error)) {
        throw new HTTPException(500, {
          message: 'Failed to upload pieces',
        });
      }

      // Insert the pieces and uploaded image into the database
      await db.transaction(async (tx) => {
        // Insert upoaded image
        const uploadedImages = await tx
          .insert(uploadedImage)
          .values(
            // Use ! because I checked before
            uploadResults.map((result, i) => ({
              imageKey: result.data!.key,
              gameId: Number(game.id),
              userId,
              isPiece: true,
              width: cutPieces[i].width,
              height: cutPieces[i].height,
            }))
          )
          .returning();

        // Insert the pieces into the database
        await tx.insert(pieces).values(
          cutPieces.map((piece, i) => ({
            col: piece.col,
            row: piece.row,
            uploadedImageId: uploadedImages[i].id,
            gameId: Number(game.id),
          }))
        );
      });

      return c.json({
        success: true,
        gameId: game.id,
        pieces: cutPieces,
        svg: piecesData.enclosedShapesSvg,
      });
    }
  )
  .get('/:id', async (c) => {
    const game = await db.query.games.findFirst({
      where: eq(games.id, Number(c.req.param('id'))),
      with: {
        pieces: {
          with: {
            uploadedImage: {
              columns: {
                imageKey: true,
              },
            },
          },
        },
        uploadedImage: true,
      },
    });

    if (!game) {
      throw new HTTPException(404, { message: 'Game not found' });
    }

    // Get the image from uploadthing
    const piecesWithUrls = game.pieces.map((piece) => ({
      ...piece,
      uploadedImage: {
        ...piece.uploadedImage,
        url: getPublicUploadthingUrl(piece.uploadedImage.imageKey),
      },
    }));

    return c.json({ ...game, pieces: piecesWithUrls });
  })
  .get('/', async (c) => {
    const currentUser = c.get('user');

    // Admin will have access to all games but logged in users will have access to games created by the admin and themselves
    const userFilter =
      currentUser.role !== 'admin'
        ? or(
            eq(games.ownerId, currentUser.id),
            eq(
              games.ownerId,
              db
                .select({ id: user.id })
                .from(user)
                .where(eq(user.role, 'admin'))
                .limit(1)
            )
          )
        : undefined;

    const userGames = await db.query.games.findMany({
      where: userFilter,
      with: {
        owner: true,
        pieces: {
          with: {
            uploadedImage: {
              columns: {
                imageKey: true,
              },
            },
          },
        },
        uploadedImage: true,
      },
    });

    const gameWithImageUrls = userGames.map((game) => ({
      ...game,
      imageUrl: getPublicUploadthingUrl(game.uploadedImage.imageKey),
    }));

    return c.json(gameWithImageUrls);
  })
  .delete('/:id', async (c) => {
    const userId = c.get('user').id;

    const userFilter = or(
      eq(games.ownerId, userId),
      eq(
        games.ownerId,
        db
          .select({ id: user.id })
          .from(user)
          .where(eq(user.role, 'admin'))
          .limit(1)
      )
    );

    const game = await db
      .delete(games)
      .where(and(eq(games.id, Number(c.req.param('id'))), userFilter));

    if (!game) {
      throw new HTTPException(404, { message: 'Game not found' });
    }

    return c.json({ success: true });
  })
  .post(
    '/sessions',
    zValidator(
      'json',
      z.object({
        gameId: z.number().int(),
        gameState: gameStateSchema,
      })
    ),
    async (c) => {
      // Not checking for user. The idea would be to share game state with other users using the sessionId
      const { gameId, gameState } = c.req.valid('json');
      const sessionId = crypto.randomUUID();

      await db.insert(gameSession).values({
        sessionId,
        gameId,
        gameState,
      });

      return c.json({ success: true, sessionId });
    }
  );
