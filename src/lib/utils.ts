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
