import { Button } from "@/frontend/components/ui/button";
import { Label } from "@/frontend/components/ui/field";
import {
  Select,
  SelectItem,
  SelectListBox,
  SelectPopover,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select";
import {
  pieceCount,
  gameDifficulty,
  jigsawBuilderFormSchema,
  JigsawBuilderFormValues,
} from "@jigsaw/shared";
import { useEffect, useRef, useState } from "react";
import UploadInput from "./upload-input";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBuilderCreate } from "../jigsaw-builder/api/mutations";
import useImageToGameData from "@/frontend/hooks/use-image-to-game-data";
import { usePath } from "../jigsaw-builder/api/queries";
import PathsMask from "../jigsaw-builder/components/paths-mask";
import { RefreshCcwIcon } from "lucide-react";

interface GameCustomizationFormProps {
  step: number;
  onNext: () => void;
  onBack: () => void;
}

export function GameCustomizationForm({
  step,
  onNext,
  onBack,
}: GameCustomizationFormProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showMask, setShowMask] = useState(false);

  const { mutate: buildJigsaw, isPending } = useBuilderCreate();

  const { handleSubmit, control, formState, watch } =
    useForm<JigsawBuilderFormValues>({
      resolver: zodResolver(jigsawBuilderFormSchema),
      defaultValues: {
        difficulty: gameDifficulty[0],
        pieceCount: pieceCount[0],
        borders: true,
      },
      mode: "onChange",
    });

  // Subscribe to piece count changes
  const pieceCountWatch = watch("pieceCount");

  // Get game data based on piece count and image dimensions
  const gameData = useImageToGameData({
    image: imgRef,
    pieceQuantity: Number(pieceCountWatch),
    enabled: isImageLoaded,
  });

  // Get paths svgs for preview
  const { data: pathsData, refetch: refetchPaths } = usePath(
    {
      origin: { x: 0, y: 0 },
      cols: gameData.columns,
      rows: gameData.rows,
      pieceSize: gameData.pieceSize,
      imgSrc: imgRef.current?.src || "",
    },
    { enabled: gameData !== null && imgRef.current !== null && isImageLoaded }
  );

  const onSubmit: SubmitHandler<JigsawBuilderFormValues> = (data) => {
    // TODO: Handle form submission
    // buildJigsaw({});
    console.log(data);
  };

  const handleImageChange = (url: string) => {
    setPreviewUrl(url);
  };

  const isNextDisabled = () => {
    if (step === 1) {
      return !previewUrl;
    }

    if (step === 2) {
      return !formState.isValid;
    }

    if (step === 3) {
      return !formState.isValid;
    }

    return false;
  };

  useEffect(() => {
    if (
      gameData !== null &&
      pathsData !== undefined &&
      imgRef.current !== null &&
      isImageLoaded
    ) {
      setShowMask(true);
    }
  }, [gameData, pathsData, isImageLoaded]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="min-h-96">
            {previewUrl ? (
              <div className="mt-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-96 w-auto mx-auto rounded-lg shadow-lg"
                />
              </div>
            ) : (
              <UploadInput onChange={handleImageChange} />
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <Controller
              control={control}
              name="pieceCount"
              render={({ field }) => (
                <Select
                  selectedKey={field.value}
                  onSelectionChange={(key) => field.onChange(key)}
                >
                  <Label>Number of Pieces</Label>
                  <SelectTrigger>
                    <SelectValue className="capitalize" />
                  </SelectTrigger>

                  <SelectPopover>
                    <SelectListBox>
                      {pieceCount.map((item) => (
                        <SelectItem
                          key={item}
                          id={item.toString()}
                          textValue={item}
                        >
                          {item}
                        </SelectItem>
                      ))}
                    </SelectListBox>
                  </SelectPopover>
                </Select>
              )}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <Controller
              control={control}
              name="difficulty"
              render={({ field }) => (
                <Select
                  {...field}
                  selectedKey={field.value}
                  onSelectionChange={(key) => field.onChange(key)}
                >
                  <Label>Difficulty</Label>
                  <SelectTrigger>
                    <SelectValue className="capitalize" />
                  </SelectTrigger>
                  <SelectPopover>
                    <SelectListBox>
                      {gameDifficulty.map((item) => (
                        <SelectItem key={item} id={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectListBox>
                  </SelectPopover>
                </Select>
              )}
            />
          </div>
        );
      case 4:
        return (
          <div className="min-h-96">
            <div className="mt-4 relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-96 w-auto mx-auto rounded-lg shadow-lg"
                ref={imgRef}
                onLoad={() => setIsImageLoaded(true)}
              />

              {showMask && (
                <PathsMask
                  className="stroke-black/80"
                  paths={pathsData?.paths || { horizontal: [], vertical: [] }}
                  pieceSize={gameData?.pieceSize}
                  scale={
                    imgRef.current?.width
                      ? imgRef.current.width / imgRef.current.naturalWidth
                      : 1
                  }
                />
              )}
            </div>
            <Button
              variant={"destructive"}
              className="flex items-center gap-2 mx-auto mt-4"
              onClick={() => refetchPaths()}
            >
              <RefreshCcwIcon size={16} />
              <span>Randomize</span>
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        {renderStep()}
        <div className="flex justify-between">
          {step > 1 && (
            <Button
              type="button"
              variant="secondary"
              className="flex mt-10"
              onClick={onBack}
            >
              Back
            </Button>
          )}
          {step <= 3 ? (
            <Button
              type="button"
              className="ml-auto flex mt-10"
              onClick={onNext}
              isDisabled={isNextDisabled()}
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              className="ml-auto flex mt-10"
              onClick={() => {}}
            >
              Create Puzzle
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
