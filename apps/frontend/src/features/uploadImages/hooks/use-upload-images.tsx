import { generateReactHelpers } from "@uploadthing/react";
import { uploadThingInitOpts } from "../uploadthing-config";
import { UploadRouter } from "@jigsaw/api-client";

export const { useUploadThing: useUploadImages } =
  generateReactHelpers<UploadRouter>(uploadThingInitOpts);
