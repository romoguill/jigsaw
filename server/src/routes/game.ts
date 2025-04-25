import { zValidator } from '@hono/zod-validator';
import {
  coordinateSchema,
  gameSchema,
  jigsawBuilderFormSchema,
} from '@jigsaw/shared/schemas.js';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { db } from 'src/db/db.js';
import { games, pieces, uploadedImage } from 'src/db/schema.js';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth-middleware.js';
import * as gameBuilderService from '../service/game-builder.js';
import { utapi } from './upload.js';

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
      const userId = c.get('user').id;

      let game: typeof games.$inferInsert;
      // Create the game entity
      // If Cached, use that info from the client to avoid rebuilding paths
      if (cached) {
        [game] = await db
          .insert(games)
          .values({
            ...gameData,
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
        pieces: cutPieces,
        svg: piecesData.enclosedShapesSvg,
      });
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
  );
