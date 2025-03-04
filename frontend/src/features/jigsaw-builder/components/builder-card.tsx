import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UploadButton } from "@/features/uploadImages/components/upload-button";
import { useState } from "react";
import BuilderForm from "./builder-form";

export function BuilderCard() {
  const [imageUpload, setImageUpload] = useState<{
    id: string;
    url: string;
  } | null>(null);

  console.log(imageUpload);

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Create New Jigsaw Puzzle</CardTitle>
        <CardDescription>
          Design your puzzle by uploading an image. Customize the options to
          your liking.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {imageUpload ? (
          <div>
            <img
              src={imageUpload.url}
              alt="Uploaded image"
              width={400}
              height={400}
              className="mx-auto object-cover"
            />
            <BuilderForm />
          </div>
        ) : (
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(file) => {
              if (file[0]) {
                setImageUpload({ id: file[0].key, url: file[0].ufsUrl });
              }
            }}
            onUploadError={(error) => {
              console.log(error);
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
