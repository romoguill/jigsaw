import { cn } from "./lib/utils";

interface CanvasProps {
  width: number | "full";
  height: number | "full";
}

function Canvas({ width, height }: CanvasProps) {
  return (
    <canvas
      className={cn({
        "h-full": height === "full",
        "w-full": width === "full",
      })}
    ></canvas>
  );
}

export default Canvas;
