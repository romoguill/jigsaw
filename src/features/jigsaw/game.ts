import { GameData } from "../../types";
import { PuzzlePiece } from "./puzzle-piece";

export class Jiggsaw {
  public pieces: PuzzlePiece[] = [];

  constructor(public readonly data: GameData) {
    // Create pieces
    this.pieces = data.flatMap((row, rowIdx) =>
      row.map(
        (piece, colIdx) =>
          new PuzzlePiece(
            piece.id,
            Math.floor(Math.random() * 500),
            Math.floor(Math.random() * 500),
            piece.image,
            {
              top: data[rowIdx - 1]?.[colIdx].id,
              right: data[rowIdx][colIdx + 1]?.id,
              bottom: data[rowIdx + 1]?.[colIdx].id,
              left: data[rowIdx][colIdx - 1]?.id,
            }
          )
      )
    );
  }
}
