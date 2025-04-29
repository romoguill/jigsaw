export type Coordinate = { x: number; y: number };

export const shapeSides = ["top", "right", "bottom", "left"] as const;
export type ShapeSide = (typeof shapeSides)[number];
export type ShapeCorners =
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight";

export type PiecesData = { id: string; image: string }[][];

export type GameData = {
  piecesData: PiecesData;
  pieceSize: number;
  pieceFootprint: number;
};

export type Theme = "dark" | "light" | "system";
