import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { mockPuzzleData } from "../data/mock";
import { Coordinate, GameData } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMouseCoordinates(
  e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
): Coordinate {
  return { x: e.clientX, y: e.clientY };
}

// TODO: To be replaced when backend api implemented
export const getPuzzleData = async (): Promise<GameData> => {
  return mockPuzzleData;
};

// Pythagoras absolute distance
export function absoluteDistance(coordinate: Coordinate): number {
  const { x, y } = coordinate;
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}
