import { Hono } from 'hono';
import { db } from '../db/db.js';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { gameStateSchema } from '@jigsaw/shared';
import { gameSession } from '../db/schema.js';
import { and, eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { getPublicUploadthingUrl } from '../lib/utils.js';
import {
  authMiddleware,
  type ContextWithAuth,
} from '../middleware/auth-middleware.js';

export const gameSessionsRoute = new Hono<ContextWithAuth>()
  .use(authMiddleware)
  .post(
    '/',
    zValidator(
      'json',
      z.object({
        gameId: z.number().int(),
        gameState: gameStateSchema
          .optional()
          .default({ pieces: [], groups: [] }),
      })
    ),
    async (c) => {
      const userId = c.get('user').id;
      const { gameId, gameState } = c.req.valid('json');
      const sessionId = crypto.randomUUID();

      await db.insert(gameSession).values({
        sessionId,
        gameId,
        userId,
        gameState,
      });

      return c.json({ success: true, sessionId });
    }
  )
  .get('/:id', async (c) => {
    const sessionId = c.req.param('id');

    const session = await db.query.gameSession.findFirst({
      where: eq(gameSession.sessionId, sessionId),
      with: {
        game: {
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
        },
      },
    });

    if (!session) {
      throw new HTTPException(404, { message: 'Session not found' });
    }

    const piecesWithUrls = session.game.pieces.map((piece) => ({
      ...piece,
      uploadedImage: {
        ...piece.uploadedImage,
        url: getPublicUploadthingUrl(piece.uploadedImage.imageKey),
      },
    }));

    const gameUrl = getPublicUploadthingUrl(
      session.game.uploadedImage.imageKey
    );

    const dataWithUrls = {
      ...session,
      game: {
        ...session.game,
        imageUrl: gameUrl,
        pieces: piecesWithUrls,
      },
    };

    return c.json(dataWithUrls);
  })
  .get('/', async (c) => {
    const user = c.get('user');

    const userFilter =
      user.role !== 'admin' ? eq(gameSession.userId, user.id) : undefined;

    const sessions = await db.query.gameSession.findMany({
      where: and(eq(gameSession.isFinished, false), userFilter),
      with: {
        game: {
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
        },
      },
    });

    const piecesWithUrls = sessions.map((session) => {
      return session.game.pieces.map((piece) => ({
        ...piece,
        uploadedImage: {
          ...piece.uploadedImage,
          url: getPublicUploadthingUrl(piece.uploadedImage.imageKey),
        },
      }));
    });

    const gameUrl = sessions.map((session) => {
      return getPublicUploadthingUrl(session.game.uploadedImage.imageKey);
    });

    const dataWithUrls = sessions.map((session, i) => {
      return {
        ...session,
        game: {
          ...session.game,
          imageUrl: gameUrl[i],
          pieces: piecesWithUrls[i],
        },
      };
    });

    return c.json(dataWithUrls);
  })
  .put(
    '/:id',
    zValidator(
      'json',
      z.object({
        gameState: gameStateSchema,
        timer: z.number().int(),
        isFinished: z.boolean(),
      })
    ),
    async (c) => {
      const sessionId = c.req.param('id');
      const { gameState, timer, isFinished } = c.req.valid('json');

      await db
        .update(gameSession)
        .set({ gameState, timer, isFinished })
        .where(eq(gameSession.sessionId, sessionId));

      return c.json({ succes: true });
    }
  );
