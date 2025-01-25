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
  shapes[1].neighbourTop = shapes[2];
  shapes[2].neighbourBottom = shapes[1];

  return shapes;
}

export function generateTestingShapes() {
  const shape1 = new Shape(
    Math.floor(Math.random() * 500),
    Math.floor(Math.random() * 500),
    "/puzzle-images/test-image_1.jpg"
  );
  const shape2 = new Shape(
    Math.floor(Math.random() * 500),
    Math.floor(Math.random() * 500),
    "/puzzle-images/test-image_2.jpg"
  );
  const shape3 = new Shape(
    Math.floor(Math.random() * 500),
    Math.floor(Math.random() * 500),
    "/puzzle-images/test-image_3.jpg"
  );
  const shape4 = new Shape(
    Math.floor(Math.random() * 500),
    Math.floor(Math.random() * 500),
    "/puzzle-images/test-image_4.jpg"
  );

  const shape5 = new Shape(
    Math.floor(Math.random() * 500),
    Math.floor(Math.random() * 500),
    "/puzzle-images/test-image_5.jpg"
  );
  const shape6 = new Shape(
    Math.floor(Math.random() * 500),
    Math.floor(Math.random() * 500),
    "/puzzle-images/test-image_6.jpg"
  );
  const shape7 = new Shape(
    Math.floor(Math.random() * 500),
    Math.floor(Math.random() * 500),
    "/puzzle-images/test-image_7.jpg"
  );
  const shape8 = new Shape(
    Math.floor(Math.random() * 500),
    Math.floor(Math.random() * 500),
    "/puzzle-images/test-image_8.jpg"
  );
  const shape9 = new Shape(
    Math.floor(Math.random() * 500),
    Math.floor(Math.random() * 500),
    "/puzzle-images/test-image_9.jpg"
  );
  const shape10 = new Shape(
    Math.floor(Math.random() * 500),
    Math.floor(Math.random() * 500),
    "/puzzle-images/test-image_10.jpg"
  );
  const shape11 = new Shape(
    Math.floor(Math.random() * 500),
    Math.floor(Math.random() * 500),
    "/puzzle-images/test-image_11.jpg"
  );
  const shape12 = new Shape(
    Math.floor(Math.random() * 500),
    Math.floor(Math.random() * 500),
    "/puzzle-images/test-image_12.jpg"
  );

  shape1.neighbourTop = null;
  shape1.neighbourRight = shape2;
  shape1.neighbourBottom = shape4;
  shape1.neighbourLeft = null;

  shape2.neighbourTop = null;
  shape2.neighbourRight = shape3;
  shape2.neighbourBottom = shape5;
  shape2.neighbourLeft = shape1;

  shape3.neighbourTop = null;
  shape3.neighbourRight = null;
  shape3.neighbourBottom = shape6;
  shape3.neighbourLeft = shape2;

  shape4.neighbourTop = shape1;
  shape4.neighbourRight = shape5;
  shape4.neighbourBottom = shape7;
  shape4.neighbourLeft = null;

  shape5.neighbourTop = shape2;
  shape5.neighbourRight = shape6;
  shape5.neighbourBottom = shape8;
  shape5.neighbourLeft = shape4;

  shape6.neighbourTop = shape3;
  shape6.neighbourRight = null;
  shape6.neighbourBottom = shape9;
  shape6.neighbourLeft = shape5;

  shape7.neighbourTop = shape4;
  shape7.neighbourRight = shape8;
  shape7.neighbourBottom = shape10;
  shape7.neighbourLeft = null;

  shape8.neighbourTop = shape5;
  shape8.neighbourRight = shape9;
  shape8.neighbourBottom = shape11;
  shape8.neighbourLeft = shape7;

  shape9.neighbourTop = shape6;
  shape9.neighbourRight = null;
  shape9.neighbourBottom = shape12;
  shape9.neighbourLeft = shape8;

  shape10.neighbourTop = shape7;
  shape10.neighbourRight = shape11;
  shape10.neighbourBottom = null;
  shape10.neighbourLeft = null;

  shape11.neighbourTop = shape8;
  shape11.neighbourRight = shape12;
  shape11.neighbourBottom = null;
  shape11.neighbourLeft = shape10;

  shape12.neighbourTop = shape9;
  shape12.neighbourRight = null;
  shape12.neighbourBottom = null;
  shape12.neighbourLeft = shape11;

  return [
    shape1,
    shape2,
    shape3,
    shape4,
    shape5,
    shape6,
    shape7,
    shape8,
    shape9,
    shape10,
    shape11,
    shape12,
  ];
}
