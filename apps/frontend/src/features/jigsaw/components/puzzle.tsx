import useGameStore from "@/frontend/store/game-store";
import { GameData } from "@/frontend/types";
import { PlayCircleIcon } from "lucide-react";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Jiggsaw } from "../jigsaw";
import Canvas from "./canvas";

interface PuzzleProps {
  puzzleData: GameData;
  onPieceMove?: () => void;
}

const Puzzle = forwardRef<Jiggsaw | null, PuzzleProps>(
  ({ puzzleData, onPieceMove }, ref) => {
    const gameRef = useRef<Jiggsaw | null>(null);
    const { isTimerRunning, resumeTimer } = useGameStore();

    // Only create a new Jiggsaw if not already created
    if (!gameRef.current) {
      gameRef.current = new Jiggsaw(puzzleData);
    }

    const jigsaw = gameRef.current;

    // Expose the jigsaw instance to the parent via ref
    useImperativeHandle(ref, () => jigsaw, [jigsaw]);

    return (
      <>
        {!isTimerRunning && jigsaw.allPiecesLoaded && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center">
            <PlayCircleIcon
              size={100}
              className="text-muted-foreground hover:text-white transition-all duration-300"
              onClick={resumeTimer}
            />
          </div>
        )}
        <Canvas jigsaw={jigsaw} onPieceMove={onPieceMove} />
      </>
    );
  }
);

export default Puzzle;
