import { zValidator } from '@hono/zod-validator';
import {
  coordinateSchema,
  gameSchema,
  jigsawBuilderFormSchema,
} from '@jigsaw/shared';
import { and, asc, desc, eq, or, sql } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { db } from '../db/db.js';
import { games, pieces, uploadedImage, user } from '../db/schema.js';
import { getPublicUploadthingUrl } from '../lib/utils.js';
import {
  authMiddleware,
  type ContextWithAuth,
} from '../middleware/auth-middleware.js';
import * as gameBuilderService from '../service/game-builder.js';
import { utapi } from './upload.js';

// Store progress updates for each game creation
const gameCreationProgress = new Map<
  string,
  {
    status: 'processing' | 'completed' | 'error';
    progress: number;
    message: string;
  }
>();

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
      progressId: z.string().optional(),
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
  .get('/builder/progress/:id', (c) => {
    const progressId = c.req.param('id');
    const progress = gameCreationProgress.get(progressId);

    if (!progress) {
      throw new HTTPException(404, { message: 'Progress not found' });
    }

    return new Response(
      new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();

          // Send initial progress
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(progress)}\n\n`)
          );

          // If completed or error, close the stream
          if (progress.status !== 'processing') {
            controller.close();
            gameCreationProgress.delete(progressId);
          }
        },
      }),
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      }
    );
  })
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
      const {
        cached,
        progressId: clientProgressId,
        ...gameData
      } = c.req.valid('json');
      const userId = c.get('user').id;
      const progressId = clientProgressId || crypto.randomUUID();

      // Initialize progress
      gameCreationProgress.set(progressId, {
        status: 'processing',
        progress: 0,
        message: 'Starting game creation...',
      });

      try {
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

        // Convert the image to a buffer
        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

        // Create the pieces
        const piecesData = gameBuilderService.createPieces({
          horizontalPaths: game.horizontalPaths,
          verticalPaths: game.verticalPaths,
          pieceSize: game.pieceSize,
        });

        // Update progress for piece creation
        gameCreationProgress.set(progressId, {
          status: 'processing',
          progress: 30,
          message: 'Creating puzzle pieces...',
        });

        // Cut the image into pieces
        const cutPieces = await gameBuilderService.cutImageIntoPieces({
          pieceFootprint: game.pieceFootprint,
          imageBuffer: Buffer.from(imageBuffer),
          ...piecesData,
        });

        // Update progress for image cutting
        gameCreationProgress.set(progressId, {
          status: 'processing',
          progress: 60,
          message: 'Cutting image into pieces...',
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

        // Update progress for database operations
        gameCreationProgress.set(progressId, {
          status: 'processing',
          progress: 90,
          message: 'Saving to database...',
        });

        // Insert the pieces and uploaded image into the database
        await db.transaction(async (tx) => {
          // Insert upoaded image
          const uploadedImages = await tx
            .insert(uploadedImage)
            .values(
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

        if (!game.id) {
          throw new HTTPException(500);
        }

        // Update progress to completed
        gameCreationProgress.set(progressId, {
          status: 'completed',
          progress: 100,
          message: 'Game creation completed!',
        });

        return c.json({
          success: true,
          gameId: game.id,
          pieces: cutPieces,
          svg: piecesData.enclosedShapesSvg,
          progressId,
        });
      } catch (error) {
        // Update progress to error
        gameCreationProgress.set(progressId, {
          status: 'error',
          progress: 0,
          message: error instanceof Error ? error.message : 'An error occurred',
        });
        throw error;
      }
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
  .get(
    '/',
    zValidator(
      'query',
      z
        .object({
          orderBy: z.enum(['pieceCount', 'difficulty']).optional(),
          orderDirection: z.enum(['asc', 'desc']).default('asc'),
        })
        .optional()
    ),
    async (c) => {
      const currentUser = c.get('user');
      const queryParams = c.req.valid('query');

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

      const orderByClause =
        queryParams?.orderBy === 'pieceCount'
          ? queryParams.orderDirection === 'asc'
            ? asc(games.pieceCount)
            : desc(games.pieceCount)
          : queryParams?.orderBy === 'difficulty'
            ? queryParams.orderDirection === 'asc'
              ? sql`CASE
                WHEN ${games.difficulty} = 'easy' THEN 1
                WHEN ${games.difficulty} = 'medium' THEN 2
                WHEN ${games.difficulty} = 'hard' THEN 3
                ELSE 4
              END`
              : sql`CASE
                WHEN ${games.difficulty} = 'easy' THEN 4
                WHEN ${games.difficulty} = 'medium' THEN 3
                WHEN ${games.difficulty} = 'hard' THEN 2
                ELSE 1
              END`
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
        orderBy: orderByClause ? [orderByClause] : undefined,
      });

      const gameWithImageUrls = userGames.map((game) => ({
        ...game,
        imageUrl: getPublicUploadthingUrl(game.uploadedImage.imageKey),
      }));

      return c.json(gameWithImageUrls);
    }
  )
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
  });
