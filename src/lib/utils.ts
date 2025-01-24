import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Coordinate } from "../types";
import { Shape } from "../features/shapes/shape";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMouseCoordinates(
  e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
): Coordinate {
  return { x: e.clientX, y: e.clientY };
}

export function generateRandomShapes(n: number) {
  const shapes: Shape[] = [];
  for (let i = 0; i < n; i++) {
    shapes.push(
      new Shape(
        Math.floor(Math.random() * 500),
        Math.floor(Math.random() * 500),
        i.toString()
      )
    );
  }

  shapes[0].neighbourRight = shapes[1];
  shapes[1].neighbourLeft = shapes[0];

  return shapes;
}
