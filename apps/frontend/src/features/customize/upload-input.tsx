import { cn } from "@/frontend/lib/utils";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useUploadImages } from "../uploadImages/hooks/use-upload-images";
import { Loader2 } from "lucide-react";

interface UploadInputProps {
  onChange: (url: string) => void;
}

function UploadInput({ onChange }: UploadInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { startUpload, isUploading, routeConfig } = useUploadImages(
    (routeRegistry) => routeRegistry.imageUploader,
    {
      onClientUploadComplete: (data) => {
        console.log(data);
      },
      onUploadError: (error: Error) => {
        toast.error(error.message);
      },
    }
  );

  const isValidFile = (file: File) => {
    if (!routeConfig?.image) return false;

    return (
      file.type.startsWith("image/") && 2_000_000 >= file.size // 2MB
    );
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = Array.from(e.target.files ?? [])[0];

    if (!isValidFile(file)) {
      toast.error("File must be an image and less than 2MB");
      e.target.value = "";
      return;
    }

    const response = await startUpload([file]);

    if (!response) {
      toast.error("Failed to upload image");
      return;
    }

    const url = response[0].ufsUrl;

    onChange(url);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = Array.from(e.dataTransfer.files)[0];
    if (!isValidFile(droppedFile)) {
      toast.error("Files must be PDFs");
      setIsDragging(false);
      return;
    }

    const response = await startUpload([droppedFile]);

    if (!response) {
      toast.error("Failed to upload image");
      return;
    }

    const url = response[0].ufsUrl;

    onChange(url);
  };

  return (
    <>
      <div
        className={cn(
          "w-full h-52 border-2 border-dashed border-input flex flex-col items-center justify-center z-30",
          {
            "border-4 border-blue-500": isDragging,
          }
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 size={32} className="animate-spin" />
          </div>
        ) : (
          <>
            <input
              ref={ref}
              type="file"
              accept="image/*"
              className="hidden"
              aria-label="Choose puzzle image"
              onChange={handleInputChange}
            />
            <p>
              Drag Images or
              <button
                className="text-blue-600 cursor-pointer underline ml-2 py-2"
                onClick={() => ref?.current?.click()}
              >
                choose from your device
              </button>
            </p>
            <span className="text-sm text-muted-foreground italic mt-1">
              Any image will do. Max 2MB.
            </span>
          </>
        )}
      </div>
    </>
  );
}
export default UploadInput;
