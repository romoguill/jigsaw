import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Coordinate } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMouseCoordinates(
  e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
): Coordinate {
  return { x: e.clientX, y: e.clientY };
}
// Pythagoras absolute distance
export function absoluteDistance(coordinate: Coordinate): number {
  const { x, y } = coordinate;
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}
