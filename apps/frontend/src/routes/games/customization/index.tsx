import { shapes } from "@/frontend/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GameCustomizationForm } from "../../../features/customize/game-customization-form";
import StepBadge from "@/frontend/features/customize/step-badge";
import { useBuilderCreate } from "@/frontend/features/jigsaw-builder/api/mutations";

export const Route = createFileRoute("/games/customization/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    image: null as File | null,
    pieceCount: undefined as number | undefined,
    difficulty: undefined as "easy" | "medium" | "hard" | undefined,
  });
  const { mutate: buildJigsaw, isPending } = useBuilderCreate();

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const onSubmit = (data: typeof formData) => {
    // TODO: Handle form submission
    buildJigsaw({});
  };

  return (
    <div className="container mx-auto py-8 px-6">
      <h1 className="text-2xl font-bold font-playful">Customize your puzzle</h1>
      <div className="max-w-2xl mx-auto mt-10">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <StepBadge stepNumber={1} step={step} description="Upload Image" />
            <StepBadge stepNumber={2} step={step} description="Piece Count" />
            <StepBadge stepNumber={3} step={step} description="Difficulty" />
          </div>
          <div className="h-1 bg-gray-200 rounded-full">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <GameCustomizationForm
          step={step}
          formData={formData}
          setFormData={setFormData}
          onNext={handleNext}
          onBack={handleBack}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
