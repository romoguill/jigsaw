import { cn } from "@/frontend/lib/utils";
import { GameDifficulty } from "@jigsaw/shared";

interface PuzzleCardProps {
  id: string;
  imageUrl: string;
  pieceCount: number;
  difficulty: GameDifficulty;
}

function PuzzleCard({ id, imageUrl, pieceCount, difficulty }: PuzzleCardProps) {
  return (
    <article className="flex flex-col gap-2">
      <img
        src={imageUrl}
        alt={`${id}-puzzle`}
        className="w-full h-32 object-cover"
      />
      <div className="flex flex-col gap-2">
        <p>{pieceCount} pieces</p>
        <p
          className={cn({
            "text-green-500": difficulty === "easy",
            "text-purple-500": difficulty === "medium",
            "text-red-500": difficulty === "hard",
          })}
        >
          {difficulty}
        </p>
      </div>
    </article>
  );
}

export default PuzzleCard;
