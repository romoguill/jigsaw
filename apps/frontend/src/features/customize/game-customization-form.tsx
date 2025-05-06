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
import { useState } from "react";
import UploadInput from "./upload-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBuilderCreate } from "../jigsaw-builder/api/mutations";

interface GameCustomizationFormProps {
  step: number;
  formData: {
    image: File | null;
    pieceCount: number | undefined;
    difficulty: "easy" | "medium" | "hard" | undefined;
  };

  onNext: () => void;
  onBack: () => void;
}

export function GameCustomizationForm({
  step,
  formData,

  onNext,
  onBack,
}: GameCustomizationFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const { mutate: buildJigsaw, isPending } = useBuilderCreate();

  const { handleSubmit, control, formState, setValue } =
    useForm<JigsawBuilderFormValues>({
      resolver: zodResolver(jigsawBuilderFormSchema),
      defaultValues: {
        difficulty: undefined,
        pieceCount: undefined,
        borders: true,
      },
    });

  const onSubmit = (data: typeof formData) => {
    // TODO: Handle form submission
    // buildJigsaw({});
    console.log(data);
  };

  const handleImageChange = (url: string) => {
    setPreviewUrl(url);
  };

  const handlePieceCountChange = (value: string) => {};

  const handleDifficultyChange = (value: string) => {};

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
            <Select
              selectedKey={formData.pieceCount?.toString()}
              onSelectionChange={handlePieceCountChange}
            >
              <Label>Number of Pieces</Label>
              <SelectTrigger>
                <SelectValue className="capitalize" />
              </SelectTrigger>
              <SelectPopover>
                <SelectListBox>
                  {pieceCount.map((item) => (
                    <SelectItem key={item} id={item.toString()}>
                      {item} pieces
                    </SelectItem>
                  ))}
                </SelectListBox>
              </SelectPopover>
            </Select>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <Select
              selectedKey={formData.difficulty}
              onSelectionChange={handleDifficultyChange}
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
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>{renderStep()}</form>
      {step > 1 && (
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      )}
      {step < 3 ? (
        <Button
          className="ml-auto flex mt-10"
          onClick={onNext}
          disabled={
            (step === 1 && !formData.image) ||
            (step === 2 && !formData.pieceCount)
          }
        >
          Next
        </Button>
      ) : (
        <Button
          className="ml-auto flex"
          onClick={() => onSubmit(formData)}
          disabled={!formData.difficulty}
        >
          Create Puzzle
        </Button>
      )}
    </div>
  );
}
