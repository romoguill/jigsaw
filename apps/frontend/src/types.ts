export type Coordinate = { x: number; y: number };

export const shapeSides = ["top", "right", "bottom", "left"] as const;
export type ShapeSide = (typeof shapeSides)[number];
export type ShapeCorners =
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight";

export type PiecesData = {
  id: string;
  image: string;
  x?: number;
  y?: number;
  group?: {
    id: string;
    originOffset: Coordinate;
  };
}[][];

export type GroupsData = {
  id: string;
  origin: Coordinate;
}[];

export type GameData = {
  piecesData: PiecesData;
  groupsData: GroupsData;
  pieceSize: number;
  pieceFootprint: number;
};

export type Theme = "dark" | "light" | "system";
