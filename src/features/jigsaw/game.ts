import { Coordinate, GameData, shapeSides } from "../../types";
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
    this.pieces = data.piecesData.flatMap((row, rowIdx) =>
      row.map(
        (piece, colIdx) =>
          new PuzzlePiece(
            piece.id,
            Math.floor(Math.random() * 500),
            Math.floor(Math.random() * 500),
            piece.image,
            {
              top: data.piecesData[rowIdx - 1]?.[colIdx].id,
              right: data.piecesData[rowIdx][colIdx + 1]?.id,
              bottom: data.piecesData[rowIdx + 1]?.[colIdx].id,
              left: data.piecesData[rowIdx][colIdx - 1]?.id,
            }
          )
      )
    );

    // Calculate puzzle size
    this.size = {
      rows: data.piecesData.length,
      cols: data.piecesData[0]?.length,
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

  moveGroup(groupId: string, position: Coordinate): void {
    const group = this.groups.get(groupId);

    if (!group) return;

    // Move the group origin coordinate
    group.origin = {
      x: group.origin.x + position.x,
      y: group.origin.y + position.y,
    };

    // Move the pieces en that group
    this.pieces
      .filter((piece) => piece.groupId === groupId)
      .forEach((piece) => piece.move(group.origin));
  }

  // SpatialGrid will be used to reduce posible calculations. Game will be divided into a grid of the same size as the pieces. That way I only check for snaping of pieces in the 8 squares arround the moved piece.
  getNearbyPieces(piece: PuzzlePiece, spatialGrid: Map<string, PuzzlePiece[]>) {
    const cellX = Math.floor(piece.position.x / this.data.pieceSize);
    const cellY = Math.floor(piece.position.y / this.data.pieceSize);
    const nearbyPieces: PuzzlePiece[] = [];

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        // Unique key for each quadrant is "cellX,cellY"
        const key = `${cellX + x},${cellY + y}`;
        nearbyPieces.push(...(spatialGrid.get(key) || []));
      }
    }

    return nearbyPieces;
  }

  // Check if two pieces can snap together
  checkSnap(draggedPiece: PuzzlePiece, otherPiece: PuzzlePiece) {
    for (const side of shapeSides) {
      // const oppositeSide = PuzzlePiece.oppositeSide(side);

      if (draggedPiece.neighbours[side] === otherPiece.id) {
        // Calculate snap offset
        const dx = otherPiece.position.x - draggedPiece.position.x;
        const dy = otherPiece.position.y - draggedPiece.position.y;
        return { x: dx, y: dy };
      }
    }

    return null;
  }

  // Find valid snaps for a group
  findValidSnaps(
    draggedGroupId: string,
    spatialGrid: Map<string, PuzzlePiece[]>
  ) {
    const validSnaps: { snappedGroupId: string; snapOffset: Coordinate }[] = [];

    this.pieces
      .filter((piece) => piece.groupId === draggedGroupId)
      .forEach((draggedPiece) => {
        const nearbyPieces = this.getNearbyPieces(draggedPiece, spatialGrid);

        nearbyPieces.forEach((otherPiece) => {
          if (otherPiece.groupId === draggedGroupId) return;

          const snap = this.checkSnap(draggedPiece, otherPiece);
          if (snap) {
            validSnaps.push({
              snappedGroupId: otherPiece.groupId,
              snapOffset: snap,
            });
          }
        });
      });

    return validSnaps;
  }
}
