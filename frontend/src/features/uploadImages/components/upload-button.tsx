import { generateUploadButton } from "@uploadthing/react";
import type { UploadThingRouter } from "../../../../../server/src/lib/uploadthing";
import { uploadThingInitOpts } from "../uploadthing-config";

export const UploadButton =
  generateUploadButton<UploadThingRouter>(uploadThingInitOpts);
