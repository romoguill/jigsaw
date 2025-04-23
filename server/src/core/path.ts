import type { Coordinate } from '@jigsaw/shared/index.js';

export class Path {
  path: string[] = [];
  // Control point refers to the point that is responsible for affecting the curvature.
  // The magnitude affects how sharp corners are. Too small and the shape has rougth cornes, while too big will result in the overall shape to be affected.
  // RANGE -> % of PIECE SIZE.
  rangeMagnitudeControlPoints: [number, number][];
  // For shapes to look good, there must be restrictions on the angles the control form has with respect to the [1, 0] vector.
  //  Arrived at them by trial and error. Mesaured in radians.
  // Good resource to dive deeper later: https://pomax.github.io/bezierinfo/#canonical
  rangeAngleControlPoints: [number, number][] = [
    [(1 / 3) * Math.PI, -(1 / 3) * Math.PI],
    [(5 / 6) * Math.PI, (7 / 6) * Math.PI],
    [(11 / 12) * Math.PI, (11 / 6) * Math.PI],
    [(1 / 6) * Math.PI, (13 / 12) * Math.PI],
    [(5 / 6) * Math.PI, (7 / 6) * Math.PI],
    [(2 / 3) * Math.PI, (4 / 3) * Math.PI],
  ];

  // For randomization of start / end points.
  rangeStartEndPoints: [number, number] = [-0.04, 0.04];

  constructor(
    public origin: Coordinate,
    public pieceSize: number,
    public pinSize: number,
    public pieceQuantity: number
  ) {
    this.path.push(`M ${origin.x} ${origin.y}`);

    // Magnitudes will depend on the curve length.
    this.rangeMagnitudeControlPoints = [
      [0.12 * pieceSize, 0.18 * pieceSize],
      [0.08 * pieceSize, 0.12 * pieceSize],
      [0.12 * pinSize, 0.18 * pinSize],
      [0.12 * pinSize, 0.18 * pinSize],
      [0.08 * pieceSize, 0.12 * pieceSize],
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
        this.rangeMagnitudeControlPoints[0],
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

      this.path.push(`C ${path.map((n) => n).join(' ')}`);

      return;
    }

    const path = [endControlPoint.x, endControlPoint.y, endPoint.x, endPoint.y];

    // Return a path string using bezier curve without start control point (previous endControlPoint = new startControlPoint).
    this.path.push(`S ${path.map((n) => n).join(' ')}`);
  }

  toString(): string {
    return this.path.join(' ');
  }

  // Get the maximum footprint of the piece. It will be the piece with both pins out plus the maximum random modifier;
  get pieceFootprint(): number {
    return (
      (this.pieceSize + this.pinSize * 2) *
      (1 + this.rangeStartEndPoints[1] - this.rangeStartEndPoints[0])
    );
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

  // Randomize the end point.
  randomEndPoint() {
    return (
      ((this.rangeStartEndPoints[1] - this.rangeStartEndPoints[0]) *
        Math.random() +
        this.rangeStartEndPoints[0]) *
      this.pieceSize
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
      x: Math.round(from.x + magnitud * Math.cos(angle)),
      y: Math.round(from.y + magnitud * Math.sin(angle)),
    };

    return controlPoint;
  }

  generateCompletePath(n: number | 'complete') {
    // Randomize if pin will be inside or outside
    const randomDirection = () => (Math.random() - 0.5 > 0 ? 1 : -1);

    // Variations in end point values to draw the side of a piece
    const endPointsDelta: (pinDirection: number) => Coordinate[] = (
      pinDirection
    ) => [
      // First flat edge
      {
        x: Math.round(this.pieceSize / 2 - this.pinSize / 2),
        y: 0,
      },
      // First side pin
      {
        x: 0,
        y: Math.round(this.pinSize * pinDirection),
      },
      // Top side pin
      {
        x: Math.round(this.pinSize),
        y: 0,
      },
      // Second side pin
      {
        x: 0,
        y: Math.round(this.pinSize * -pinDirection),
      },
      // Second flat edge
      {
        x: Math.round(this.pieceSize / 2 - this.pinSize / 2),
        y: 0,
      },
    ];

    let iterations: number;

    n === 'complete' ? (iterations = this.pieceQuantity) : (iterations = n);

    for (let j = 0; j < iterations; j++) {
      // Save the end point before the loop
      let prevEndPoint = { ...this.endPoint };

      const pinDirection = randomDirection();

      endPointsDelta(pinDirection).forEach((epd, i) => {
        const endPoint = {
          x: Math.round(prevEndPoint.x + epd.x),
          y: Math.round(prevEndPoint.y + epd.y),
        };

        prevEndPoint = { ...endPoint };

        const controlPoint = this.generateControlPoint(
          this.rangeMagnitudeControlPoints[i + 1],
          this.rangeAngleControlPoints[i + 1].map(
            (range) => range * pinDirection
          ) as [number, number],
          endPoint
        );

        this.appendCurve({
          endPoint,
          endControlPoint: controlPoint,
        });

        // Randomize the end point except for the last one of the piece.
        if ((i + 1) % 5 !== 0) {
          let newPath = '';
          const path = this.path[this.path.length - 1];

          const randomizedEndPoint = {
            x: Math.round(endPoint.x + this.randomEndPoint()),
            y: Math.round(endPoint.y + this.randomEndPoint()),
          };

          // Since the control point is relative to the end point, we need to update it.
          const deltaX = randomizedEndPoint.x - endPoint.x;
          const deltaY = randomizedEndPoint.y - endPoint.y;

          const randomizedControlEndPoint = {
            x: Math.round(controlPoint.x + deltaX),
            y: Math.round(controlPoint.y + deltaY),
          };

          newPath = path.replace(
            `${controlPoint.x} ${controlPoint.y} ${endPoint.x} ${endPoint.y}`,
            `${randomizedControlEndPoint.x} ${randomizedControlEndPoint.y} ${randomizedEndPoint.x} ${randomizedEndPoint.y}`
          );

          // Replace the last path with the new one.
          this.path[this.path.length - 1] = newPath;
        }
      });
    }
  }
}
