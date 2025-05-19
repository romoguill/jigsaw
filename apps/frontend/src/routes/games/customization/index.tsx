import StepBadge from "@/frontend/features/customize/step-badge";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GameCustomizationForm } from "../../../features/customize/game-customization-form";

export const Route = createFileRoute("/games/customization/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    <div className="container mx-auto py-8 px-6">
      <h1 className="text-2xl font-bold font-playful">Customize your puzzle</h1>
      <div className="mx-auto mt-10">
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 justify-between mb-4 gap-2 md:gap-4">
            <StepBadge stepNumber={1} step={step} description="Upload Image" />
            <StepBadge stepNumber={2} step={step} description="Piece Count" />
            <StepBadge stepNumber={3} step={step} description="Difficulty" />
            <StepBadge stepNumber={4} step={step} description="Preview" />
          </div>
          <div className="h-1 bg-gray-200 rounded-full">
            <div
              className="h-full bg-green-400 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <GameCustomizationForm
          step={step}
          onNext={handleNext}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}
