import { Coordinate, GameData } from "../../types";
import { PieceGroup } from "./piece-group";
import { PuzzlePiece } from "./puzzle-piece";

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

    // Initialize groups, one per piece
    this.pieces.forEach((piece) => {
      const piecesMap = new Map([[piece.id, piece.position]]);
      const group = new PieceGroup(piece.position, piecesMap);

      this.groups.set(group.id, group);
    });

    // Calculate puzzle size
    this.size = {
      rows: data.length,
      cols: data[0]?.length,
    };
  }

  mergeGroups(
    groupIdA: string,
    groupIdB: string,
    snapOffset: Coordinate
  ): PieceGroup {
    const groupA = this.groups.get(groupIdA)!;
    const groupB = this.groups.get(groupIdB)!;

    // Update groupB's pieces to be relative to groupA's origin
    groupB.pieces.forEach((offset, pieceId) => {
      const adjustedOffset = {
        x: offset.x + snapOffset.x,
        y: offset.y + snapOffset.y,
      };
      groupA.pieces.set(pieceId, adjustedOffset);
    });

    // Update all pieces in groupB to point to groupA
    this.pieces.forEach((piece) => {
      if (piece.groupId === groupIdB) {
        piece.groupId = groupIdA;
        piece.offsetFromGroupOrigin = groupA.pieces.get(piece.id)!;
      }
    });

    // Delete groupB
    this.groups.delete(groupIdB);

    return groupA;
  }
}
