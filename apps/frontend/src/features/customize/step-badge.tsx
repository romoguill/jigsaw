import { cn, shapes } from "@/frontend/lib/utils";

interface StepBadgeProps {
  stepNumber: number;
  step: number;
  description: string;
}

function StepBadge({ stepNumber, step, description }: StepBadgeProps) {
  const colors = ["fill-sky-400", "fill-lime-400", "fill-emerald-400"];

  return (
    <div className="flex items-center">
      <div
        className={cn(
          "h-20 w-20 flex items-center justify-center mr-2 text-white opacity-30 relative",
          colors[stepNumber - 1],
          {
            "text-white": stepNumber === step,
            "opacity-100": stepNumber === step,
          }
        )}
      >
        {shapes[5]}
        <span className="absolute font-bold text-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {stepNumber}
        </span>
      </div>
      <span>{description}</span>
    </div>
  );
}
export default StepBadge;
