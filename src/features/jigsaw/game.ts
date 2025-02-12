import { Coordinate, GameData } from "../../types";
import { PuzzlePiece } from "./puzzle-piece";

interface PieceGroup {
  origin: Coordinate;
}

export class Jiggsaw {
  pieces: PuzzlePiece[] = [];
  groups: Map<string, PieceGroup> = new Map([]);
  size: { rows: number; cols: number } = { rows: 0, cols: 0 };

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

    // Calculate puzzle size
    this.size = {
      rows: data.length,
      cols: data[0]?.length,
    };
  }

  // Utility for merging groups. A into B and delete B from the Map
  private mergeGroups(groupIdA: string, groupIdB: string): PieceGroup {
    const groupA = this.groups.get(groupIdA)!;
    const groupB = this.groups.get(groupIdB)!;

    this.pieces
      .filter((piece) => piece.groupId === groupIdB)
      .forEach((piece) => {
        piece.groupId = groupIdA;

        // Need to calculate new offset. The new offset would be the sum of the group origin plus its offset to that group origin
        const absolutePosition = {
          x: groupB.origin.x + piece.offsetFromGroupOrigin.x,
          y: groupB.origin.y + piece.offsetFromGroupOrigin.y,
        };

        // Offset relative to new origin is the absolute position minus the new group origin
        piece.offsetFromGroupOrigin = {
          x: absolutePosition.x - groupA.origin.x,
          y: absolutePosition.y - groupA.origin.y,
        };
      });

    // Delete groupB
    this.groups.delete(groupIdB);

    return groupA;
  }
}
