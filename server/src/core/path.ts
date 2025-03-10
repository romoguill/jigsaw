import type { Coordinate } from '../../shared/types.js';

export class Path {
  path: string[] = [];
  // Control point refers to the point that is responsible for affecting the curvature.
  // The magnitude affects how sharp corners are. Too small and the shape has rougth cornes, while too big will result in the overall shape to be affected.
  // RANGE -> % of PIECE SIZE.
  rangeMagnitudeControlPoint: [number, number][];
  // For shapes to look good, there must be restrictions on the angles the control form has with respect to the [1, 0] vector.
  //  Arrived at them by trial and error. Mesaured in radians.
  rangeAngleControlPoints: [number, number][] = [
    [(1 / 3) * Math.PI, -(1 / 3) * Math.PI],
    [(1 / 3) * Math.PI, -(1 / 3) * Math.PI],
    [Math.PI, (5 / 3) * Math.PI],
    [(1 / 12) * Math.PI, (11 / 12) * Math.PI],
    [(7 / 12) * Math.PI, (5 / 4) * Math.PI],
    [(2 / 3) * Math.PI, (4 / 3) * Math.PI],
  ];

  constructor(
    public origin: Coordinate,
    public pieceSize: number,
    public pinSize: number,
    public pieceQuantity: number
  ) {
    this.path.push(`M ${origin.x} ${origin.y}`);

    // Magnitudes will depend on the curve length.
    this.rangeMagnitudeControlPoint = [
      [0.12 * pieceSize, 0.18 * pieceSize],
      [0.18 * pinSize, 0.22 * pinSize],
      [0.12 * pinSize, 0.18 * pinSize],
      [0.12 * pinSize, 0.18 * pinSize],
      [0.18 * pinSize, 0.22 * pinSize],
      [0.12 * pieceSize, 0.18 * pieceSize],
    ];
  }

  appendCurve({
    endControlPoint,
    endPoint,
  }: {
    endPoint: Coordinate;
    endControlPoint: Coordinate;
  }): void {
    // The first point must specify a starting control point
    if (this.path.length <= 1) {
      const startControlPoint = this.generateControlPoint(
        this.rangeMagnitudeControlPoint[0],
        this.rangeAngleControlPoints[0],
        this.origin
      );

      const path = [
        startControlPoint.x,
        startControlPoint.y,
        endControlPoint.x,
        endControlPoint.y,
        endPoint.x,
        endPoint.y,
      ];

      // Return a path string using bezier curve with start control point.

      this.path.push(`C ${path.map((n) => n.toFixed(2)).join(' ')}`);

      return;
    }

    const path = [endControlPoint.x, endControlPoint.y, endPoint.x, endPoint.y];

    // Return a path string using bezier curve without start control point (previous endControlPoint = new startControlPoint).
    this.path.push(`S ${path.map((n) => n.toFixed(2)).join(' ')}`);
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

  // Using a base magnitud (piece body and pin will have different bases) and the range, get a random value
  randomMagnitude(magnitudeRange: [number, number]) {
    return (
      (magnitudeRange[1] - magnitudeRange[0]) * Math.random() +
      magnitudeRange[0]
    );
  }

  // Get a random angle. Always positive < 2 pi
  randomAngle(angleRange: [number, number]) {
    return (
      ((angleRange[1] - angleRange[0]) * Math.random() + angleRange[0]) %
      (2 * Math.PI)
    );
  }

  generateControlPoint(
    magnitudeRange: [number, number],
    angleRange: [number, number],
    from: Coordinate
  ): Coordinate {
    const magnitud = this.randomMagnitude(magnitudeRange);
    const angle = this.randomAngle(angleRange);

    const controlPoint: Coordinate = {
      x: from.x + magnitud * Math.cos(angle),
      y: from.y + magnitud * Math.sin(angle),
    };

    console.log({ magnitud, angle, endPoint: this.endPoint, controlPoint });

    return controlPoint;
  }

  generateCompletePath(n: number | 'complete') {
    // Variations in end point values to draw the side of a piece
    const endPointsDelta: Coordinate[] = [
      // First flat edge
      {
        x: this.pieceSize / 2 - this.pinSize / 2,
        y: 0,
      },
      // First side pin
      {
        x: 0,
        y: this.pinSize,
      },
      // Top side pin
      {
        x: this.pinSize,
        y: 0,
      },
      // Second side pin
      {
        x: 0,
        y: -this.pinSize,
      },
      // Second flat edge
      {
        x: this.pieceSize / 2 - this.pinSize / 2,
        y: 0,
      },
    ];

    let iterations: number;

    n === 'complete' ? (iterations = this.pieceQuantity) : (iterations = n);

    for (let j = 0; j < iterations; j++) {
      endPointsDelta.forEach((epd, i) => {
        const endPoint = {
          x: this.endPoint.x + epd.x,
          y: this.endPoint.y + epd.y,
        };
        const controlPoint = this.generateControlPoint(
          this.rangeMagnitudeControlPoint[i + 1],
          this.rangeAngleControlPoints[i + 1],
          endPoint
        );

        this.appendCurve({
          endPoint: { x: this.endPoint.x + epd.x, y: this.endPoint.y + epd.y },
          endControlPoint: controlPoint,
        });
      });
    }
  }
}
