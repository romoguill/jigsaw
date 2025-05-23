import { cn } from "@/frontend/lib/utils";
import { Paths } from "@jigsaw/shared";

interface PathsMaskProps {
  paths: Paths;
  pieceSize: number;
  scale: number;
  className?: string;
}

function PathsMask({ paths, pieceSize, scale, className }: PathsMaskProps) {
  const rect = {
    height: (paths.horizontal.length + 1) * pieceSize,
    width: (paths.vertical.length + 1) * pieceSize,
  };

  return (
    <svg
      className={cn(
        "stroke-white/60 stroke-[10] fill-none absolute top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%]",
        className
      )}
      width={rect.width * scale}
      height={rect.height * scale}
    >
      <g>
        {paths.horizontal.map((path, i) => (
          <path
            key={i}
            d={path}
            transform={`translate(0 ${(i + 1) * pieceSize * scale}) scale(${scale})`}
          />
        ))}
      </g>

      <g transform={`rotate(90)`}>
        {paths.vertical.map((path, i) => (
          <path
            key={i}
            d={path}
            transform={`translate(0 ${(-i - 1) * pieceSize * scale}) scale(${scale})`}
          />
        ))}
      </g>

      <g>
        <rect
          width={rect.width}
          height={rect.height}
          strokeWidth={20}
          transform={`scale(${scale})`}
        />
      </g>
    </svg>
  );
}
export default PathsMask;
