import { Coordinate } from "../../types";

export class PieceGroup {
  // Position: some combined position of all shapes
  // Pieces: pieceId, offset from group center
  constructor(
    public origin: Coordinate,
    public pieces: Map<string, Coordinate>
  ) {}
}
