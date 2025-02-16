import { cn } from "@/lib/utils";
import PuzzlePiece from "./puzzle-piece";
import { Button } from "./ui/button";

type Scheme = "red" | "green" | "blue" | "yellow" | "pink" | "purple";

interface ButtonMainOptionProps {
  withPiece?: boolean;
  scheme: Scheme;
  children: React.ReactNode;
}

function ButtonMainOption({
  children,
  scheme,
  withPiece = false,
}: ButtonMainOptionProps) {
  return (
    <Button
      variant="ghost"
      className={cn("group cursor-pointer", {
        "data-[hovered]:bg-red-400/30": scheme === "red",
        "data-[hovered]:bg-green-400/30": scheme === "green",
        "data-[hovered]:bg-blue-400/30": scheme === "blue",
        "data-[hovered]:bg-yellow-400/30": scheme === "yellow",
        "data-[hovered]:bg-pink-400/30": scheme === "pink",
        "data-[hovered]:bg-purple-400/30": scheme === "purple",
      })}
    >
      <div className="relative w-36">
        {withPiece && (
          <PuzzlePiece className="rotate-90 fill-red-500 size-6 hidden group-hover:block absolute left-0 top-[50%] -translate-y-[50%]" />
        )}
        {children}
      </div>
    </Button>
  );
}

export default ButtonMainOption;
