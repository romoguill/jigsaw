import { generateUploadButton } from "@uploadthing/react";
import { uploadThingInitOpts } from "../uploadthing-config";
import type { UploadRouter } from "@jigsaw/shared";

// import "@uploadthing/react/styles.css";

export const UploadButton =
  generateUploadButton<UploadRouter>(uploadThingInitOpts);
