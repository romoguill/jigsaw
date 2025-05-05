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
import { pieceCount, gameDifficulty } from "@jigsaw/shared";
import { useState } from "react";

interface GameCustomizationFormProps {
  step: number;
  formData: {
    image: File | null;
    pieceCount: number | undefined;
    difficulty: "easy" | "medium" | "hard" | undefined;
  };
  setFormData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
  onSubmit: (data: any) => void;
}

export function GameCustomizationForm({
  step,
  formData,
  setFormData,
  onNext,
  onBack,
  onSubmit,
}: GameCustomizationFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handlePieceCountChange = (value: string) => {
    setFormData({ ...formData, pieceCount: Number(value) });
  };

  const handleDifficultyChange = (value: string) => {
    setFormData({
      ...formData,
      difficulty: value as "easy" | "medium" | "hard",
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Upload Image</Label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-white
                  hover:file:bg-primary/90"
              />
            </div>
            {previewUrl && (
              <div className="mt-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-64 w-auto mx-auto rounded-lg shadow-lg"
                />
              </div>
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
    <div className="space-y-6">
      {renderStep()}
      <div className="flex justify-between pt-4">
        {step > 1 && (
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
        {step < 3 ? (
          <Button
            className="ml-auto"
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
            className="ml-auto"
            onClick={() => onSubmit(formData)}
            disabled={!formData.difficulty}
          >
            Create Puzzle
          </Button>
        )}
      </div>
    </div>
  );
}
