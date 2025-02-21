import { UploadButton } from "@/features/uploadImages/components/upload-button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(file) => {
          console.log("uploaded", file);
        }}
        onUploadError={(error) => {
          console.log(error);
        }}
      />
    </div>
  );
}
