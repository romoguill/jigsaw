import { GameData } from "@/frontend/types";
import { useRef } from "react";
import { Jiggsaw } from "../jigsaw";
import Canvas from "./canvas";

interface PuzzleProps {
  puzzleData: GameData;
}

function Puzzle({ puzzleData }: PuzzleProps) {
  const gameRef = useRef<Jiggsaw | null>(null);

  gameRef.current = new Jiggsaw(puzzleData);
  const jigsaw = gameRef.current;

  return <Canvas jigsaw={jigsaw} />;
}

export default Puzzle;
