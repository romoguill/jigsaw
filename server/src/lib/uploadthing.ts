import {
  createUploadthing,
  UploadThingError,
  type FileRouter,
} from 'uploadthing/server';
import { db } from '../db/db.js';
import { uploadedImage } from '../db/schema.js';
import { auth } from './auth.js';
import { HTTPException } from 'hono/http-exception';

const f = createUploadthing();

export const uploadRouter = {
  imageUploader: f({
    image: {
      maxFileCount: 1,
      maxFileSize: '2MB',
    },
  })
    .middleware(async ({ req }) => {
      const session = await auth.api.getSession({ headers: req.headers });

      if (!session) {
        throw new UploadThingError('Unauthorized');
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      await db.insert(uploadedImage).values({
        imageUrl: file.ufsUrl,
        userId: metadata.userId,
      });
    }),
} satisfies FileRouter;

export type UploadThingRouter = typeof uploadRouter;
