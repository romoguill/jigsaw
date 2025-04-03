import type { Coordinate } from '@jigsaw/shared/index.js';
import { Vector } from './vector.js';

type DecomposedPath = {
  origin: Coordinate;
  completeSegments: string[][];
};

type SegmentDetails = {
  startPoint: Coordinate;
  endPoint: Coordinate;
  controlPointStart: Coordinate;
  controlPointEnd: Coordinate;
};

type EnclosedCurvesDetails = {
  top: SegmentDetails[];
  right: SegmentDetails[];
  bottom: SegmentDetails[];
  left: SegmentDetails[];
};

export class Path {
  path: string[] = [];
  // Control point refers to the point that is responsible for affecting the curvature.
  // The magnitude affects how sharp corners are. Too small and the shape has rougth cornes, while too big will result in the overall shape to be affected.
  // RANGE -> % of PIECE SIZE.
  rangeMagnitudeControlPoint: [number, number][];
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
        x: this.pieceSize / 2 - this.pinSize / 2,
        y: 0,
      },
      // First side pin
      {
        x: 0,
        y: this.pinSize * pinDirection,
      },
      // Top side pin
      {
        x: this.pinSize,
        y: 0,
      },
      // Second side pin
      {
        x: 0,
        y: this.pinSize * -pinDirection,
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
      const pinDirection = randomDirection();

      endPointsDelta(pinDirection).forEach((epd, i) => {
        const endPoint = {
          x: this.endPoint.x + epd.x,
          y: this.endPoint.y + epd.y,
        };
        const controlPoint = this.generateControlPoint(
          this.rangeMagnitudeControlPoint[i + 1],
          this.rangeAngleControlPoints[i + 1].map(
            (range) => range * pinDirection
          ) as [number, number],
          endPoint
        );

        this.appendCurve({
          endPoint: { x: this.endPoint.x + epd.x, y: this.endPoint.y + epd.y },
          endControlPoint: controlPoint,
        });
      });
    }
  }

  // Decompose the path into segments (curves both longhand and shorthand)
  static segmentsDecomposer(path: string): DecomposedPath {
    const [x, y] = path.split('M')[1].split(' ').map(Number);
    // Get the path segments without the M, C or S. Remove the first element because it's the MoveTo command.
    const pathArray = path.split(/[CS]/).slice(1);

    //
    const completeSegments: string[][] = [];
    let partialSegments: string[] = [];
    pathArray.forEach((segment, i) => {
      const values = segment.trim().split(' ');

      partialSegments.push(...values);

      // Every 5 segments, push the partial segments to the complete segments. 5 segments for each piece side.
      if ((i + 1) % 5 === 0) {
        completeSegments.push(partialSegments);
        partialSegments = [];
      }
    });

    console.log(completeSegments);

    return { origin: { x, y }, completeSegments };
  }

  // Get the details of a segment (all necesary points to create curves)
  static segmentDetails(
    decomposedPath: DecomposedPath,
    n: number
  ): SegmentDetails {
    if (n === 0) {
      return {
        startPoint: {
          x: decomposedPath.origin.x,
          y: decomposedPath.origin.y,
        },
        endPoint: {
          x: Number(
            decomposedPath.completeSegments[n][
              decomposedPath.completeSegments[n].length - 2
            ]
          ),
          y: Number(
            decomposedPath.completeSegments[n][
              decomposedPath.completeSegments[n].length - 1
            ]
          ),
        },
        controlPointStart: {
          x: Number(decomposedPath.completeSegments[n][0]),
          y: Number(decomposedPath.completeSegments[n][1]),
        },
        controlPointEnd: {
          x: Number(
            decomposedPath.completeSegments[n][
              decomposedPath.completeSegments[n].length - 4
            ]
          ),
          y: Number(
            decomposedPath.completeSegments[n][
              decomposedPath.completeSegments[n].length - 3
            ]
          ),
        },
      };
    } else {
      return {
        startPoint: {
          x: Number(
            decomposedPath.completeSegments[n - 1][
              decomposedPath.completeSegments[n - 1].length - 2
            ]
          ),
          y: Number(
            decomposedPath.completeSegments[n - 1][
              decomposedPath.completeSegments[n - 1].length - 1
            ]
          ),
        },
        endPoint: {
          x: Number(
            decomposedPath.completeSegments[n][
              decomposedPath.completeSegments[n].length - 2
            ]
          ),
          y: Number(
            decomposedPath.completeSegments[n][
              decomposedPath.completeSegments[n].length - 1
            ]
          ),
        },
        controlPointStart: {
          x: Number(decomposedPath.completeSegments[n - 1][0]),
          y: Number(decomposedPath.completeSegments[n - 1][1]),
        },
        controlPointEnd: {
          x: Number(
            decomposedPath.completeSegments[n][
              decomposedPath.completeSegments[n].length - 4
            ]
          ),
          y: Number(
            decomposedPath.completeSegments[n][
              decomposedPath.completeSegments[n].length - 3
            ]
          ),
        },
      };
    }
  }

  static getCurvesDetails(
    decomposedPath: DecomposedPath,
    n: number
  ): SegmentDetails[] {
    // First curve is different from rest.
    const curvesDetails: SegmentDetails[] = [
      {
        startPoint: decomposedPath.origin,
        endPoint: {
          x: Number(decomposedPath.completeSegments[n][4]),
          y: Number(decomposedPath.completeSegments[n][5]),
        },
        controlPointStart: {
          x: Number(decomposedPath.completeSegments[n][0]),
          y: Number(decomposedPath.completeSegments[n][1]),
        },
        controlPointEnd: {
          x: Number(decomposedPath.completeSegments[n][2]),
          y: Number(decomposedPath.completeSegments[n][3]),
        },
      },
    ];

    // Slice the segments, extract the details until there are no more segments.
    let remainingSegments = decomposedPath.completeSegments[n].slice(6);
    let count = 1;
    while (remainingSegments.length > 0) {
      const startPoint = {
        x: curvesDetails[count - 1].endPoint.x,
        y: curvesDetails[count - 1].endPoint.y,
      };

      const endPoint = {
        x: Number(remainingSegments[2]),
        y: Number(remainingSegments[3]),
      };

      const controlPointStart = {
        x: curvesDetails[count - 1].controlPointEnd.x,
        y: curvesDetails[count - 1].controlPointEnd.y,
      };

      const controlPointEnd = {
        x: Number(remainingSegments[0]),
        y: Number(remainingSegments[1]),
      };

      curvesDetails.push({
        startPoint,
        endPoint,
        controlPointStart,
        controlPointEnd,
      });

      remainingSegments = remainingSegments.slice(4);
      count++;
    }

    return curvesDetails;
  }

  static reverseSegment(segment: SegmentDetails): SegmentDetails {
    return {
      startPoint: segment.endPoint,
      endPoint: segment.startPoint,
      controlPointStart: segment.controlPointEnd,
      controlPointEnd: segment.controlPointStart,
    };
  }

  // Create an enclosing path from the segments and the row and column of the piece.
  static createEnclosingPath(
    paths: {
      horizontalPaths: string[];
      verticalPaths: string[];
    },
    row: number,
    column: number,
    pieceSize: number
  ): EnclosedCurvesDetails {
    // Get the paths of the horizontal and vertical paths of the piece. Top and bottom; left and right.
    const horizontalPaths = [
      paths.horizontalPaths[row],
      paths.horizontalPaths[row + 1],
    ];
    const verticalPaths = [
      paths.verticalPaths[column],
      paths.verticalPaths[column + 1],
    ];

    // Decompose the paths into segments.
    const horizontalDecomposedPaths = horizontalPaths.map((path) =>
      this.segmentsDecomposer(path)
    );

    const verticalDecomposedPaths = verticalPaths.map((path) =>
      this.segmentsDecomposer(path)
    );

    // Will store the details of the segments of the enclosed curves. AKA the curves forming the puzzle piece.
    const enclosedCurvesDetails: EnclosedCurvesDetails = {
      top: [],
      right: [],
      bottom: [],
      left: [],
    };
    // Get the details of the segments. Add to the coordinates the piece size. All paths are created from 0, 0. In reality the first would be the border.
    const [topSegmentDetails, bottomSegmentDetails] = horizontalDecomposedPaths
      .map((path) => this.getCurvesDetails(path, row))
      .map((curvesDetails, i) => {
        return curvesDetails.map((curveDetail) => {
          Object.entries(curveDetail).forEach(([_key, value]) => {
            value.x += pieceSize * (row + 1);
            value.y += pieceSize * (row + 1 + i);
          });
          return curveDetail;
        });
      });

    enclosedCurvesDetails.top = topSegmentDetails;

    // Must reverse bottom segment to make it clockwise and a closed path.
    const reversedBottomSegment = bottomSegmentDetails.map((curveDetail) => {
      return this.reverseSegment(curveDetail);
    });

    enclosedCurvesDetails.bottom = reversedBottomSegment;

    const [leftSegmentDetails, rightSegmentDetails] = verticalDecomposedPaths
      .map((path) => this.getCurvesDetails(path, row))
      .map((curvesDetails, i) => {
        return curvesDetails.map((curveDetail) => {
          Object.entries(curveDetail).forEach(([_key, value]) => {
            value.x += pieceSize * (column + 1 + i);
            value.y += pieceSize * (column + 1);
          });
          return curveDetail;
        });
      });

    enclosedCurvesDetails.right = rightSegmentDetails;

    // Must reverse bottom segment to make it clockwise and a closed path.
    const reversedLeftSegment = leftSegmentDetails.map((curveDetail) => {
      return this.reverseSegment(curveDetail);
    });

    enclosedCurvesDetails.left = reversedLeftSegment;

    // Vertical paths need to be rotated 90 degrees since all paths are created from 0, 0 along x axis.
    // Rotate left.
    enclosedCurvesDetails.left.forEach((curveDetail) => {
      const leftControlPointStartVector = new Vector(
        curveDetail.startPoint,
        curveDetail.controlPointStart
      );
      const leftControlPointEndVector = new Vector(
        curveDetail.endPoint,
        curveDetail.controlPointEnd
      );

      const leftControlPointStartVector90 =
        leftControlPointStartVector.rotateVector90();
      const leftControlPointEndVector90 =
        leftControlPointEndVector.rotateVector90();

      curveDetail.controlPointStart =
        leftControlPointStartVector90.toCoordinate(curveDetail.startPoint);
      curveDetail.controlPointEnd = leftControlPointEndVector90.toCoordinate(
        curveDetail.endPoint
      );
    });

    // Rotate right.
    enclosedCurvesDetails.right.forEach((curveDetail) => {
      const rightControlPointStartVector = new Vector(
        curveDetail.startPoint,
        curveDetail.controlPointStart
      );
      const rightControlPointEndVector = new Vector(
        curveDetail.endPoint,
        curveDetail.controlPointEnd
      );

      const rightControlPointStartVector90 =
        rightControlPointStartVector.rotateVector90();
      const rightControlPointEndVector90 =
        rightControlPointEndVector.rotateVector90();

      curveDetail.controlPointStart =
        rightControlPointStartVector90.toCoordinate(curveDetail.startPoint);
      curveDetail.controlPointEnd = rightControlPointEndVector90.toCoordinate(
        curveDetail.endPoint
      );
    });

    console.log(JSON.stringify(enclosedCurvesDetails, null, 2));

    return enclosedCurvesDetails;
  }

  // Get the path svg from the closed path
  static getPathSvg(segments: EnclosedCurvesDetails): string {
    const close = 'Z';
    const moveTo = `M ${segments.top[0].startPoint.x} ${segments.top[0].startPoint.y}`;

    // Set callback for readability.
    const firstCurve = (segment: SegmentDetails) =>
      `C ${segment.controlPointStart.x} ${segment.controlPointStart.y} ${segment.controlPointEnd.x} ${segment.controlPointEnd.y} ${segment.endPoint.x} ${segment.endPoint.y}`;

    const otherCurves = (segment: SegmentDetails) =>
      `S ${segment.controlPointEnd.x} ${segment.controlPointEnd.y} ${segment.endPoint.x} ${segment.endPoint.y}`;

    const curves: {
      [key in keyof EnclosedCurvesDetails]: string;
    } = {
      top: '',
      right: '',
      bottom: '',
      left: '',
    };

    // Reduce the segments using previous callbacks to a single path string.
    Object.entries(segments).forEach(([key, segment]) => {
      const curve = segment.reduce((acc, segment) => {
        return acc + ' ' + otherCurves(segment);
      }, firstCurve(segment[0]));

      curves[key as keyof EnclosedCurvesDetails] = curve;
    });

    return `${moveTo} ${curves.top} ${curves.right} ${curves.bottom} ${curves.left} ${close}`;
  }
}
