import type { Coordinate } from '../../shared/types.js';

export class Path {
  path: string[] = [];
  // Control point refers to the point that is responsible for affecting the curvature.
  // The magnitude affects how sharp corners are. Too small and the shape has rougth cornes, while too big will result in the overall shape to be affected.
  // RANGE -> % of PIECE SIZE.
  rangeMagnitudeControlPoint: [number, number] = [0.2, 0.4];

  constructor(
    public origin: Coordinate,
    pieceSize: number,
    pieceQuantity: number
  ) {
    this.path.push(`M ${origin.x} ${origin.y}`);
  }

  createCurve({
    startControlPoint,
    endControlPoint,
    endPoint,
  }: {
    endPoint: Coordinate;
    endControlPoint: Coordinate;
    startControlPoint?: Coordinate;
  }) {
    if (startControlPoint) {
      const path = [
        startControlPoint.x,
        startControlPoint.y,
        endControlPoint.x,
        endControlPoint.y,
        endPoint.x,
        endPoint.y,
      ];

      return path.reduce((prev, curr) => prev.concat(curr.toFixed(2)), 'C');
    } else {
      const path = [
        endControlPoint.x,
        endControlPoint.y,
        endPoint.x,
        endPoint.y,
      ];
      return path.reduce((prev, curr) => prev.concat(curr.toFixed(2)), 'S');
    }
  }
}
