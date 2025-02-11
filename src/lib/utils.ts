import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Coordinate } from "../types";
import { PuzzlePiece } from "../features/jigsaw/puzzle-piece";
import { mockPuzzleData } from "../data/mock";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMouseCoordinates(
  e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
): Coordinate {
  return { x: e.clientX, y: e.clientY };
}

// TODO: To be replaced when backend api implemented
export const getPuzzleData = () => {
  return mockPuzzleData;
};
