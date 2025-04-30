import { GroupState, pieceStateSchema } from "@jigsaw/shared";
import { z } from "zod";

export type Coordinate = { x: number; y: number };

export const shapeSides = ["top", "right", "bottom", "left"] as const;
export type ShapeSide = (typeof shapeSides)[number];
export type ShapeCorners =
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight";

export const piecesDataSchema = z.array(
  z.array(
    z
      .object({ id: z.number(), image: z.string() })
      .merge(pieceStateSchema.omit({ id: true }).partial())
  )
);

export type PiecesData = z.infer<typeof piecesDataSchema>;

export type GameData = {
  piecesData: PiecesData;
  groupsData: GroupState[];
  pieceSize: number;
  pieceFootprint: number;
};

export type Theme = "dark" | "light" | "system";
