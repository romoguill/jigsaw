import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UploadButton } from "@/features/uploadImages/components/upload-button";

export function BuilderCard() {
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
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(file) => {
            console.log("uploaded", file);
          }}
          onUploadError={(error) => {
            console.log(error);
          }}
        />
      </CardContent>
    </Card>
  );
}
