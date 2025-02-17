import { cn } from "@/lib/utils";
import PuzzlePiece from "./puzzle-piece";
import { Button } from "./ui/button";

interface ButtonMainOptionProps {
  withPiece?: boolean;
  children: React.ReactNode;
}

function ButtonMainOption({
  children,
  withPiece = false,
}: ButtonMainOptionProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "group cursor-pointer rounded-none font-playful text-2xl data-[hovered]:bg-linear-to-r from-sky-200/40 "
      )}
    >
      <div className="relative w-56">
        {withPiece && (
          <PuzzlePiece className="rotate-90 fill-background size-6 hidden group-data-[hovered]:block absolute left-0 top-[50%] -translate-y-[50%]" />
        )}
        {children}
      </div>
    </Button>
  );
}

export default ButtonMainOption;
