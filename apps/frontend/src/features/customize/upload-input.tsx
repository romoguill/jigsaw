import { cn } from "@/frontend/lib/utils";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useUploadImages } from "../uploadImages/hooks/use-upload-images";

interface UploadInputProps {
  onChange: (file: File) => void;
}

function UploadInput({ onChange }: UploadInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
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

    await startUpload([file]);
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

    await startUpload([droppedFile]);

    setIsDragging(false);
  };

  return (
    <>
      <div
        className={cn(
          "w-full h-52 border-2 border-dashed border-input flex flex-col items-center justify-center",
          {
            "border-4 border-blue-500": isDragging,
          }
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
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
          <span
            className="text-blue-600 cursor-pointer underline ml-2"
            onClick={() => ref?.current?.click()}
          >
            choose from your device
          </span>
        </p>
        <span className="text-sm text-muted-foreground italic mt-1">
          Any image will do. Max 2MB.
        </span>
      </div>
    </>
  );
}
export default UploadInput;
