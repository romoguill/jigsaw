import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UploadButton } from "@/features/uploadImages/components/upload-button";
import { useRef, useState } from "react";
import BuilderForm from "./builder-form";
import PreviewPiecesButton from "./preview-pieces-button";
import { usePaths } from "../api/queries";
import useImageToGameData from "@/hooks/use-image-to-game-data";
import PathsMask from "./paths-mask";

const pieceQuantity = 50;

export function BuilderCard() {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageUpload, setImageUpload] = useState<{
    id: string;
    url: string;
  } | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const [enableQuery, setEnableQuery] = useState(false);
  const gameData = useImageToGameData({ image: imgRef, pieceQuantity });
  console.log(gameData);
  const { data: paths, isPending } = usePaths(
    {
      origin: { x: 0, y: 0 },
      cols: gameData?.columns || 0,
      rows: gameData?.rows || 0,
      pieceSize: gameData?.pieceSize || 0,
      pinSize: (gameData?.pieceSize || 0) * 0.2,
    },
    { enabled: enableQuery && gameData !== null }
  );

  console.log({ gameData });

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
            <div className="relative">
              {imageLoaded && (
                <PreviewPiecesButton
                  onPreview={() => setEnableQuery(true)}
                  isLoading={isPending && enableQuery}
                />
              )}
              <img
                src={imageUpload.url}
                alt="Uploaded image"
                width={400}
                height={400}
                className="mx-auto object-cover w-full max-h-[600px]"
                ref={imgRef}
                onLoad={() => setImageLoaded(true)}
              />
              {enableQuery && paths && gameData && imgRef.current && (
                <PathsMask
                  paths={paths}
                  pieceSize={gameData?.pieceSize}
                  scale={imgRef.current.width / imgRef.current.naturalWidth}
                />
              )}
            </div>
            <BuilderForm imageId={imageUpload.id} />
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
