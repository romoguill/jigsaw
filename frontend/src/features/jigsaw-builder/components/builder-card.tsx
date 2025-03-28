import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UploadButton } from "@/features/uploadImages/components/upload-button";
import useImageToGameData from "@/hooks/use-image-to-game-data";
import { useCallback, useRef, useState } from "react";
import { usePath } from "../api/queries";
import BuilderForm from "./builder-form";
import PathsMask from "./paths-mask";
import PreviewPiecesButton from "./preview-pieces-button";

export function BuilderCard() {
  const imgRef = useRef<HTMLImageElement>(null);
  const [pieceQuantity, setPieceQuantity] = useState<number | undefined>(
    undefined
  );
  const [imageUpload, setImageUpload] = useState<{
    id: string;
    url: string;
  } | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [enableQuery, setEnableQuery] = useState(false);

  const gameData = useImageToGameData({ image: imgRef, pieceQuantity });

  const { data: paths, isPending } = usePath(
    {
      origin: { x: 0, y: 0 },
      cols: gameData?.columns || 0,
      rows: gameData?.rows || 0,
      pieceSize: gameData?.pieceSize || 0,
      pinSize: (gameData?.pieceSize || 0) * 0.2,
      imgSrc: imgRef.current?.src || "",
    },
    { enabled: enableQuery && gameData !== null }
  );

  const handlePieceQuantityChange = useCallback((n: number | undefined) => {
    if (n === undefined) return;

    setPieceQuantity(n);
  }, []);

  console.log(showPreview);
  const handlePreview = (toggle: boolean) => {
    // Just enable query if it's not enabled
    if (!enableQuery) setEnableQuery(true);

    setShowPreview(toggle);
  };

  const showMask =
    enableQuery && showPreview && paths && gameData && imgRef.current;

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
                  isToggled={showPreview}
                  onToggle={(toogle) => handlePreview(toogle)}
                  isLoading={isPending && enableQuery}
                />
              )}
              <img
                src={imageUpload.url}
                alt="Uploaded image"
                width={400}
                height={400}
                className="mx-auto object-cover w-full"
                ref={imgRef}
                onLoad={() => setImageLoaded(true)}
              />
              {showMask && (
                <PathsMask
                  paths={paths}
                  pieceSize={gameData?.pieceSize}
                  scale={imgRef.current.width / imgRef.current.naturalWidth}
                />
              )}
            </div>
            <BuilderForm
              imageId={imageUpload.id}
              onPieceQuantityChange={handlePieceQuantityChange}
            />
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
