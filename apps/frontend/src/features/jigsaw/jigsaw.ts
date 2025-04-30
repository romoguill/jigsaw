import { GameState, GroupState } from "@jigsaw/shared";
import { absoluteDistance } from "../../lib/utils";
import { Coordinate, GameData, ShapeSide, shapeSides } from "../../types";
import { PuzzlePiece } from "./puzzle-piece";

export interface PieceGroup {
  id: number;
  origin: Coordinate;
}

export class Jiggsaw {
  pieces: PuzzlePiece[] = [];
  groups: Map<number, PieceGroup> = new Map([]);
  size: { rows: number; cols: number } = { rows: 0, cols: 0 };
  snapThreshold: number = 0;
  allPiecesLoaded = false;

  constructor(
    public readonly data: GameData,
    public readonly groupsData?: GroupState[]
  ) {
    // Create pieces
    this.pieces = data.piecesData.flatMap((row, rowIdx) =>
      row.map((piece, colIdx) => {
        const puzzlePiece = new PuzzlePiece(
          piece.id,
          piece.x ?? Math.floor(Math.random() * 500),
          piece.y ?? Math.floor(Math.random() * 500),
          piece.image,
          data.pieceSize,
          data.pieceFootprint,
          {
            top: data.piecesData[rowIdx - 1]?.[colIdx].id,
            right: data.piecesData[rowIdx][colIdx + 1]?.id,
            bottom: data.piecesData[rowIdx + 1]?.[colIdx].id,
            left: data.piecesData[rowIdx][colIdx - 1]?.id,
          },
          piece.group?.id
        );

        if (puzzlePiece.groupId && piece.group) {
          puzzlePiece.offsetFromGroupOrigin = {
            x: piece.group.originOffset.x,
            y: piece.group.originOffset.y,
          };
        }

        return puzzlePiece;
      })
    );

    // If game is new, generate new groups, else use the groups from the data
    if (groupsData) {
      groupsData.forEach((group) => {
        this.groups.set(group.id, { id: group.id, origin: group.origin });
      });
    } else {
      this.pieces.forEach((piece) => {
        this.groups.set(piece.id, { id: piece.id, origin: piece.position });
      });
    }

    // Calculate puzzle size
    this.size = {
      rows: data.piecesData.length,
      cols: data.piecesData[0]?.length,
    };

    // Set snap threshold to % of piece size
    this.snapThreshold = (data.pieceSize * 10) / 100;

    // Check if all pieces are loaded
    this.checkAllPiecesLoaded();
  }

  // Check if all pieces have loaded their images
  checkAllPiecesLoaded(): boolean {
    this.allPiecesLoaded = this.pieces.every((piece) => piece.isImageLoaded);
    return this.allPiecesLoaded;
  }

  // Utility for merging groups. A into B and delete B from the Map
  private mergeGroups(groupIdA: number, groupIdB: number): PieceGroup {
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

  moveGroup(groupId: number, delta: Coordinate): void {
    const group = this.groups.get(groupId);

    if (!group) return;

    // Move the group origin coordinate
    group.origin = {
      x: group.origin.x + delta.x,
      y: group.origin.y + delta.y,
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

  snap(draggedGroupId: number, targetGroupId: number, delta: Coordinate) {
    this.moveGroup(draggedGroupId, delta);

    this.mergeGroups(draggedGroupId, targetGroupId);
  }

  // Check if two pieces can snap together
  private checkSnap(draggedPiece: PuzzlePiece, otherPiece: PuzzlePiece) {
    for (const side of shapeSides) {
      if (draggedPiece.neighbours[side] === otherPiece.id) {
        const relativeCoordinates = draggedPiece.relativeCoordinatesTo(
          side,
          otherPiece
        );
        const distanceToOtherPiece = absoluteDistance(relativeCoordinates);

        if (distanceToOtherPiece < this.snapThreshold) {
          return {
            side,
            relativeCoordinates,
          };
        }

        return false;
      }
    }

    return null;
  }

  // Find valid snaps for a group
  findValidSnaps(
    draggedGroupId: number,
    spatialGrid: Map<string, PuzzlePiece[]>
  ) {
    const validSnaps: {
      snappedGroupId: number;
      side: ShapeSide;
      delta: Coordinate;
    }[] = [];

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
              side: snap.side,
              delta: snap.relativeCoordinates,
            });
          }
        });
      });

    return validSnaps;
  }

  // Get the game state. Used for saving the game
  getGameState(): GameState {
    return {
      pieces: this.pieces.map((piece) => ({
        id: piece.id,
        x: piece.position.x,
        y: piece.position.y,
        group: {
          id: piece.groupId,
          originOffset: piece.offsetFromGroupOrigin,
        },
      })),
      groups: Array.from(this.groups.values()),
    };
  }
}
