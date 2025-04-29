import { cn } from "@/frontend/lib/utils";
import { GameDifficulty } from "@jigsaw/shared";
import { PlayCircle } from "lucide-react";

interface PuzzleCardProps {
  id: string;
  imageUrl: string;
  pieceCount: number;
  difficulty: GameDifficulty;
  onClick?: () => void;
}

function PuzzleCard({
  id,
  imageUrl,
  pieceCount,
  difficulty,
  onClick,
}: PuzzleCardProps) {
  const difficultyConfig = {
    easy: { color: "bg-green-400", text: "text-green-900", label: "Easy" },
    medium: {
      color: "bg-purple-400",
      text: "text-purple-900",
      label: "Medium",
    },
    hard: { color: "bg-red-400", text: "text-red-900", label: "Hard" },
  };

  const config = difficultyConfig[difficulty];

  return (
    <article
      className="group relative overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={`${id}-puzzle`}
          className="w-full h-40 object-cover will-change-transform transform-gpu transition-transform duration-300 group-hover:scale-105"
          style={{
            imageRendering: "crisp-edges",
            backfaceVisibility: "hidden",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <PlayCircle className="w-16 h-16 text-white drop-shadow-lg" />
        </div>
      </div>

      <div className="p-4 bg-slate-900 font-sans">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500 antialiased">
            {pieceCount} pieces
          </span>
          <span
            className={cn(
              "px-2 py-1.5 rounded-full text-xs font-semibold leading-none transition-colors duration-300",
              config.color,
              config.text
            )}
          >
            {config.label}
          </span>
        </div>
      </div>
    </article>
  );
}

export default PuzzleCard;
