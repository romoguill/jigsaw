import type { Coordinate } from '../../shared/types.js';

export class Path {
  path: string[] = [];
  // Control point refers to the point that is responsible for affecting the curvature.
  // The magnitude affects how sharp corners are. Too small and the shape has rougth cornes, while too big will result in the overall shape to be affected.
  // RANGE -> % of PIECE SIZE.
  rangeMagnitudeControlPoint: [number, number] = [0.2, 0.4];

  constructor(
    public origin: Coordinate,
    public pieceSize: number,
    public pinSize: number,
    public pieceQuantity: number
  ) {
    this.path.push(`M ${origin.x} ${origin.y}`);
  }

  appendCurve({
    startControlPoint,
    endControlPoint,
    endPoint,
  }: {
    endPoint: Coordinate;
    endControlPoint: Coordinate;
    startControlPoint?: Coordinate;
  }): void {
    if (startControlPoint) {
      const path = [
        startControlPoint.x,
        startControlPoint.y,
        endControlPoint.x,
        endControlPoint.y,
        endPoint.x,
        endPoint.y,
      ];

      // Return a path string using bezier curve with start control point.

      this.path.push(`C ${path.join(' ')}`);
    } else {
      if (this.path.length <= 1) {
        throw new Error(
          'Missing the first curve with C command to set the starting control point.'
        );
      }

      const path = [
        endControlPoint.x,
        endControlPoint.y,
        endPoint.x,
        endPoint.y,
      ];

      // Return a path string using bezier curve without start control point (previous endControlPoint = new startControlPoint).
      this.path.push(`S ${path.join(' ')}`);
    }
  }

  toString(): string {
    return this.path.join(' ');
  }

  get endPoint(): Coordinate {
    // Endpoint are the two last values of any curve except the len = 1
    if (this.path.length <= 1) return this.origin;

    const lastDigits = this.path[this.path.length - 1].split(' ').slice(-2);

    return {
      x: Number(lastDigits[0]),
      y: Number(lastDigits[1]),
    };
  }

  generateCompletePath() {
    const endPoints: Coordinate[] = [
      {
        x: this.pieceSize / 2 - this.pinSize / 2 + this.endPoint.x,
        y: 0 + this.endPoint.y,
      },
    ];
  }
}
