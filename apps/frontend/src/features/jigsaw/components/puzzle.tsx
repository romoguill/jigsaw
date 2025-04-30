import { GameData } from "@/frontend/types";
import { GameState } from "@jigsaw/shared";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Jiggsaw } from "../jigsaw";
import Canvas from "./canvas";

interface PuzzleProps {
  puzzleData: GameData;
}

const Puzzle = forwardRef<Jiggsaw | null, PuzzleProps>(
  ({ puzzleData }, ref) => {
    const gameRef = useRef<Jiggsaw | null>(null);

    console.log({ puzzleData });

    // Only create a new Jiggsaw if not already created
    if (!gameRef.current) {
      gameRef.current = new Jiggsaw(puzzleData);
    }

    console.log({ puzzleData });

    const jigsaw = gameRef.current;

    console.log(JSON.stringify(jigsaw, null, 2));
    // Expose the jigsaw instance to the parent via ref
    useImperativeHandle(ref, () => jigsaw, [jigsaw]);

    return <Canvas jigsaw={jigsaw} />;
  }
);

export default Puzzle;
