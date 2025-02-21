import { generateReactHelpers } from "@uploadthing/react";
import { UploadThingRouter } from "../../../../../server/src/lib/uploadthing";
import { uploadThingInitOpts } from "../uploadthing-config";

export const { useUploadThing: useUploadImages } =
  generateReactHelpers<UploadThingRouter>(uploadThingInitOpts);
