import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GameCustomizationForm } from "../../../features/customize/game-customization-form";
import { shapes } from "@/frontend/lib/utils";

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

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = (data: typeof formData) => {
    // TODO: Handle form submission
    console.log("Form submitted:", data);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Create Your Jigsaw Puzzle</h1>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div
              className={`flex items-center ${step >= 1 ? "text-primary" : "text-gray-400"}`}
            >
              <div className="h-20 w-20 flex items-center justify-center mr-2 fill-sky-400/80 text-white relative">
                {shapes[5]}
                <span className="absolute font-bold text-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  1
                </span>
              </div>
              <span>Upload Image</span>
            </div>
            <div
              className={`flex items-center ${step >= 2 ? "text-primary" : "text-gray-400"}`}
            >
              <div className="h-20 w-20 flex items-center justify-center mr-2 fill-emerald-400/80 text-white relative">
                {shapes[12]}
                <span className="absolute font-bold text-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  2
                </span>
              </div>
              <span>Piece Count</span>
            </div>
            <div
              className={`flex items-center ${step >= 3 ? "text-primary" : "text-gray-400"}`}
            >
              <div className="h-20 w-20 flex items-center justify-center mr-2 fill-lime-400/80 text-white relative">
                {shapes[9]}
                <span className="absolute font-bold text-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  3
                </span>
              </div>
              <span>Difficulty</span>
            </div>
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
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
