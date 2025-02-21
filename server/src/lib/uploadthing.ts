import { createUploadthing, type FileRouter } from 'uploadthing/server';

const f = createUploadthing();

export const uploadRouter = {
  imageUploader: f({
    image: {
      maxFileCount: 1,
      maxFileSize: '2MB',
    },
  }).onUploadComplete((data) => {
    console.log('upload complete', data);
  }),
} satisfies FileRouter;

export type UploadThingRouter = typeof uploadRouter;
