import { Coordinate } from "../../types";

export class PieceGroup {
  id: string = crypto.randomUUID();

  // Position: some combined position of all shapes
  // Pieces: pieceId, offset from group center
  constructor(
    public position: Coordinate,
    public pieces: Map<string, Coordinate>
  ) {}
}
