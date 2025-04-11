import type { Coordinate } from '@jigsaw/shared';

export class PieceSide {
  // The origin of the PieceSide. All paths generated when building the game are relative to this origin.
  static origin: Coordinate = { x: 0, y: 0 };

  constructor(
    public readonly startPoint: Coordinate,
    public readonly endPoint: Coordinate,
    public readonly controlPointStart: Coordinate,
    public readonly controlPointEnd: Coordinate
  ) {}

  static fromPath(path: string[]): PieceSide {
    if (path.length !== 4 && path.length !== 6) {
      throw new Error('Invalid Path');
    }

    // If the path has 6 elements, it's a longhand cubic curve.
    if (path.length === 6) {
      const startPoint = this.origin;
      const endPoint = {
        x: Number(path[4]),
        y: Number(path[5]),
      };
      const controlPointStart = {
        x: Number(path[0]),
        y: Number(path[1]),
      };
      const controlPointEnd = {
        x: Number(path[2]),
        y: Number(path[3]),
      };

      return new PieceSide(
        startPoint,
        endPoint,
        controlPointStart,
        controlPointEnd
      );
    }

    // If the path has 4 elements, it's a shorthand quadratic curve.
    const startPoint = this.origin;
    const endPoint = {
      x: Number(path[2]),
      y: Number(path[3]),
    };

    return new PieceSide(
      startPoint,
      endPoint,
      controlPointStart,
      controlPointEnd
    );
  }
}
