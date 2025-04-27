import sharp from 'sharp';
import {
  createUploadthing,
  UploadThingError,
  type FileRouter,
} from 'uploadthing/server';
import { db } from '../db/db.js';
import { uploadedImage } from '../db/schema.js';
import { auth } from './auth.js';

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

      return {
        userId: session.user.id,
      };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      try {
        // Fetch the image data and get the metadata
        const response = await fetch(file.ufsUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const fileMetadata = await sharp(buffer).metadata();

        // Insert the image into the database
        await db.insert(uploadedImage).values({
          imageKey: file.key,
          userId: metadata.userId,
          width: fileMetadata.width ?? 0,
          height: fileMetadata.height ?? 0,
        });
      } catch (error) {
        console.error('Error processing image:', error);
        throw error;
      }
    }),
} satisfies FileRouter;

export type UploadThingRouter = typeof uploadRouter;
