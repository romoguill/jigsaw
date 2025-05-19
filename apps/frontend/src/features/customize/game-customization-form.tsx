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
import useImageToGameData from "@/frontend/hooks/use-image-to-game-data";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  gameDifficulty,
  jigsawBuilderFormSchema,
  JigsawBuilderFormValues,
  pieceCount,
} from "@jigsaw/shared";
import { useNavigate } from "@tanstack/react-router";
import { RefreshCcwIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreateGameSession } from "../games/api/mutations";
import { useBuilderCreate } from "../jigsaw-builder/api/mutations";
import { usePath } from "../jigsaw-builder/api/queries";
import PathsMask from "../jigsaw-builder/components/paths-mask";
import UploadInput from "./upload-input";

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
  const [imageKey, setImageKey] = useState<string>("");
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showMask, setShowMask] = useState(false);
  const navigate = useNavigate({ from: "/games/customization" });
  // const [progress, setProgress] = useState<GameCreationProgress | null>(null);

  const { mutateAsync: buildJigsaw } = useBuilderCreate();
  const { mutateAsync: createGameSession } = useCreateGameSession();

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

  const onSubmit: SubmitHandler<JigsawBuilderFormValues> = async (data) => {
    console.log("run");

    try {
      const builderResponse = await buildJigsaw({
        data: {
          ...data,
          pieceSize: gameData.pieceSize,
          columns: gameData.columns,
          rows: gameData.rows,
          origin: { x: 0, y: 0 },
          imageKey: imageKey,
          cached:
            pathsData?.paths.horizontal && pathsData.paths.vertical
              ? {
                  horizontalPaths: pathsData.paths.horizontal,
                  verticalPaths: pathsData.paths.vertical,
                  pieceFootprint: pathsData.pieceFootprint,
                }
              : undefined,
        },
        // onProgress: (progress: GameCreationProgress) => {
        //   setProgress(progress);
        //   if (progress.status === "completed") {
        //     navigate({ to: "/admin" });
        //   }
        // },
      });

      const sessionResponse = await createGameSession({
        gameId: builderResponse.gameId,
      });

      navigate({ to: `/games/sessions/${sessionResponse.sessionId}` });
    } catch (error) {
      toast.error("Failed to create game");
      console.error(error);
    }
  };

  const handleImageChange = (url: string, key: string) => {
    setPreviewUrl(url);
    setImageKey(key);
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
      imgRef !== null &&
      imgRef.current !== null &&
      isImageLoaded
    ) {
      setShowMask(true);
    } else {
      setShowMask(false);
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
          <div className="min-h-96 flex flex-col justify-between items-center">
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
                  scale={imgRef.current!.width / imgRef.current!.naturalWidth}
                />
              )}
            </div>
            {isImageLoaded && (
              <Button
                variant={"destructive"}
                className="flex items-center gap-2 mx-auto mt-4"
                onClick={() => refetchPaths()}
              >
                <RefreshCcwIcon size={16} />
                <span>Randomize</span>
              </Button>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault(); // To prevent form submission when clicking on the back or next buttons
    onNext();
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        {renderStep()}
        <div className="flex justify-between items-center mt-10">
          {step > 1 && (
            <button
              type="button"
              className="flex pl-7 pr-4 py-2 w-22 text-primary-foreground rounded-md hover:bg-indigo-400 disabled:opacity-50 disabled:pointer-events-none [clip-path:polygon(25%_0%,100%_0%,100%_100%,25%_100%,0%_50%)] border-r-8 border-indigo-700 bg-indigo-200 cursor-pointer"
              onClick={onBack}
            >
              Back
            </button>
          )}
          {step <= 3 ? (
            <button
              type="button"
              className="ml-auto flex pl-4 pr-7 py-2 w-22 bg-amber-200 text-primary-foreground rounded-md hover:bg-amber-400 disabled:opacity-50 disabled:pointer-events-none [clip-path:polygon(0%_0%,75%_0%,100%_50%,75%_100%,0%_100%)] border-l-8 border-amber-700 cursor-pointer"
              onClick={handleNextClick}
              disabled={isNextDisabled()}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={formState.isSubmitting}
              className="ml-auto flex px-4 py-2 bg-amber-700 rounded-md disabled:opacity-50 disabled:pointer-events-none cursor-pointer text-secondary-foreground tracking-widest font-bold text-shadow-md text-shadow-back/80"
            >
              Create Puzzle
            </button>
          )}
        </div>
        {formState.isSubmitting && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <ul className="text-slate-800 text-2xl font-bold p-8 bg-neutral-300 rounded-lg space-y-2">
              <li>Generating pieces.</li>
              <li>Cutting images.</li>
              <li className="italic text-sm">This may take a while...</li>
            </ul>
          </div>
        )}
      </form>
    </div>
  );
}
