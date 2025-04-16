import type { Coordinate } from '@jigsaw/shared/index.js';

// type DecomposedPath = {
//   origin: Coordinate;
//   completeSegments: string[][];
// };

// type SegmentDetails = {
//   startPoint: Coordinate;
//   endPoint: Coordinate;
//   controlPointStart: Coordinate;
//   controlPointEnd: Coordinate;
// };

// type EnclosedCurvesDetails = {
//   top: SegmentDetails[];
//   right: SegmentDetails[];
//   bottom: SegmentDetails[];
//   left: SegmentDetails[];
// };

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
}

// Decompose the path into segments (curves both longhand and shorthand)
// static segmentsDecomposer(path: string): DecomposedPath {
// const [x, y] = path.split('M')[1].split(' ').map(Number);
// // Get the path segments without the M, C or S. Remove the first element because it's the MoveTo command.
// const pathArray = path.split(/[CS]/).slice(1);
// //
// const completeSegments: string[][] = [];
// let partialSegments: string[] = [];
// pathArray.forEach((segment, i) => {
//   const values = segment.trim().split(' ');
//   partialSegments.push(...values);
//   // Every 5 segments, push the partial segments to the complete segments. 5 segments for each piece side.
//   if ((i + 1) % 5 === 0) {
//     completeSegments.push(partialSegments);
//     partialSegments = [];
//   }
// });
// return { origin: { x, y }, completeSegments };
// }

// Get the details of a segment (all necesary points to create curves)
// static segmentDetails(
//   decomposedPath: DecomposedPath,
//   n: number
// ): SegmentDetails {
//   if (n === 0) {
//     return {
//       startPoint: {
//         x: decomposedPath.origin.x,
//         y: decomposedPath.origin.y,
//       },
//       endPoint: {
//         x: Number(
//           decomposedPath.completeSegments[n][
//             decomposedPath.completeSegments[n].length - 2
//           ]
//         ),
//         y: Number(
//           decomposedPath.completeSegments[n][
//             decomposedPath.completeSegments[n].length - 1
//           ]
//         ),
//       },
//       controlPointStart: {
//         x: Number(decomposedPath.completeSegments[n][0]),
//         y: Number(decomposedPath.completeSegments[n][1]),
//       },
//       controlPointEnd: {
//         x: Number(
//           decomposedPath.completeSegments[n][
//             decomposedPath.completeSegments[n].length - 4
//           ]
//         ),
//         y: Number(
//           decomposedPath.completeSegments[n][
//             decomposedPath.completeSegments[n].length - 3
//           ]
//         ),
//       },
//     };
//   } else {
//     return {
//       startPoint: {
//         x: Number(
//           decomposedPath.completeSegments[n - 1][
//             decomposedPath.completeSegments[n - 1].length - 2
//           ]
//         ),
//         y: Number(
//           decomposedPath.completeSegments[n - 1][
//             decomposedPath.completeSegments[n - 1].length - 1
//           ]
//         ),
//       },
//       endPoint: {
//         x: Number(
//           decomposedPath.completeSegments[n][
//             decomposedPath.completeSegments[n].length - 2
//           ]
//         ),
//         y: Number(
//           decomposedPath.completeSegments[n][
//             decomposedPath.completeSegments[n].length - 1
//           ]
//         ),
//       },
//       controlPointStart: {
//         x: Number(decomposedPath.completeSegments[n - 1][0]),
//         y: Number(decomposedPath.completeSegments[n - 1][1]),
//       },
//       controlPointEnd: {
//         x: Number(
//           decomposedPath.completeSegments[n][
//             decomposedPath.completeSegments[n].length - 4
//           ]
//         ),
//         y: Number(
//           decomposedPath.completeSegments[n][
//             decomposedPath.completeSegments[n].length - 3
//           ]
//         ),
//       },
//     };
//   }
// }

// static getCurvesDetails(
//   decomposedPath: DecomposedPath,
//   n: number
// ): SegmentDetails[] {
//   console.log('decomposedPath', decomposedPath);
//   let remainingSegments: string[] = [];
//   // First curve is different from rest.
//   let curvesDetails: SegmentDetails[] = [];
//   if (n === 0) {
//     curvesDetails = [
//       {
//         startPoint: decomposedPath.origin,
//         endPoint: {
//           x: Number(decomposedPath.completeSegments[n][4]),
//           y: Number(decomposedPath.completeSegments[n][5]),
//         },
//         controlPointStart: {
//           x: Number(decomposedPath.completeSegments[n][0]),
//           y: Number(decomposedPath.completeSegments[n][1]),
//         },
//         controlPointEnd: {
//           x: Number(decomposedPath.completeSegments[n][2]),
//           y: Number(decomposedPath.completeSegments[n][3]),
//         },
//       },
//     ];
//     remainingSegments = decomposedPath.completeSegments[n].slice(6);
//   } else {
//     console.log(
//       'decomposedPath.completeSegments[n]',
//       decomposedPath.completeSegments[n - 1]
//     );
//     curvesDetails = [
//       {
//         startPoint: {
//           x: Number(decomposedPath.completeSegments[n - 1][20]),
//           y: Number(decomposedPath.completeSegments[n - 1][21]),
//         },
//         endPoint: {
//           x: Number(decomposedPath.completeSegments[n][4]),
//           y: Number(decomposedPath.completeSegments[n][5]),
//         },
//         controlPointStart: {
//           x: Number(decomposedPath.completeSegments[n][0]),
//           y: Number(decomposedPath.completeSegments[n][1]),
//         },
//         controlPointEnd: {
//           x: Number(decomposedPath.completeSegments[n][2]),
//           y: Number(decomposedPath.completeSegments[n][3]),
//         },
//       },
//     ];
//     remainingSegments = decomposedPath.completeSegments[n].slice(4);
//   }

//   // Slice the segments, extract the details until there are no more segments.
//   let count = 1;
//   while (remainingSegments.length > 0) {
//     const startPoint = {
//       x: curvesDetails[count - 1].endPoint.x,
//       y: curvesDetails[count - 1].endPoint.y,
//     };

//     const endPoint = {
//       x: Number(remainingSegments[2]),
//       y: Number(remainingSegments[3]),
//     };

//     const controlPointStart = {
//       x: curvesDetails[count - 1].controlPointEnd.x,
//       y: curvesDetails[count - 1].controlPointEnd.y,
//     };

//     const controlPointEnd = {
//       x: Number(remainingSegments[0]),
//       y: Number(remainingSegments[1]),
//     };

//     curvesDetails.push({
//       startPoint,
//       endPoint,
//       controlPointStart,
//       controlPointEnd,
//     });

//     remainingSegments = remainingSegments.slice(4);
//     count++;
//   }

//   return curvesDetails;
// }

// static reverseCurve(curve: SegmentDetails): SegmentDetails {
//   // return {
//   //   startPoint: curve.endPoint,
//   //   endPoint: curve.startPoint,
//   //   controlPointStart: curve.controlPointEnd,
//   //   controlPointEnd: curve.controlPointStart,
//   // };
// }

// static reverseSegment(segment: SegmentDetails[]): SegmentDetails[] {
//   // First reverse each curve individually. Points and control points are swaped
//   const reversedIndividually = segment.map((curve) =>
//     this.reverseCurve(curve)
//   );

//   // Then reverse the order of the curves.
//   reversedIndividually.reverse();

//   // Control points need to be rotated 180 degrees.
//   reversedIndividually.forEach((curve, i) => {
//     // Segment start control point not rotated because it's generated to match the contiguous curves.
//     if (i !== 0) {
//       const controlPointStartVector = new Vector(
//         curve.controlPointStart,
//         curve.startPoint
//       );

//       controlPointStartVector.rotateVector180();

//       curve.controlPointStart = controlPointStartVector
//         .translateOrigin(curve.startPoint)
//         .toCoordinate();
//     }

//     // Segment end control point not rotated because it's generated to match the contiguous curves.
//     if (i !== reversedIndividually.length - 1) {
//       const controlPointEndVector = new Vector(
//         curve.controlPointEnd,
//         curve.endPoint
//       );

//       controlPointEndVector.rotateVector180();

//       curve.controlPointEnd = controlPointEndVector
//         .translateOrigin(curve.endPoint)
//         .toCoordinate();
//     }
//   });

//   return reversedIndividually;
// }

// // Used to rotate 90deg the vertical paths
// static rotateSegment90(curveDetails: SegmentDetails[]): SegmentDetails[] {
//   // Use the first segment's start point as the rotation origin.
//   const rotationOrigin = curveDetails[0].startPoint;

//   const rotatedCurveDetails = curveDetails.map((segment) => {
//     const relativeVectors: {
//       toStartPoint: Vector;
//       toEndPoint: Vector;
//       toControlPointStart: Vector;
//       toControlPointEnd: Vector;
//     } = {
//       toStartPoint: new Vector(segment.startPoint, rotationOrigin),
//       toControlPointStart: new Vector(
//         segment.controlPointStart,
//         rotationOrigin
//       ),
//       toEndPoint: new Vector(segment.endPoint, rotationOrigin),
//       toControlPointEnd: new Vector(segment.controlPointEnd, rotationOrigin),
//     };

//     // Apply the rotation to all vectors.
//     for (const vector of Object.values(relativeVectors)) {
//       vector.rotateVector90();
//     }

//     return {
//       startPoint: relativeVectors.toStartPoint
//         .translateOrigin(rotationOrigin)
//         .toCoordinate(),
//       endPoint: relativeVectors.toEndPoint
//         .translateOrigin(rotationOrigin)
//         .toCoordinate(),
//       controlPointStart: relativeVectors.toControlPointStart
//         .translateOrigin(rotationOrigin)
//         .toCoordinate(),
//       controlPointEnd: relativeVectors.toControlPointEnd
//         .translateOrigin(rotationOrigin)
//         .toCoordinate(),
//     };
//   });

//   return rotatedCurveDetails;
// }

// // Create an enclosing path from the segments and the row and column of the piece.
// static createEnclosingPath(
//   paths: {
//     horizontalPaths: string[];
//     verticalPaths: string[];
//   },
//   row: number,
//   column: number,
//   pieceSize: number
// ): EnclosedCurvesDetails {
//   // Get the paths of the horizontal and vertical paths of the piece. Top and bottom; left and right.
//   const horizontalPaths = [
//     paths.horizontalPaths[row],
//     paths.horizontalPaths[row + 1],
//   ];
//   const verticalPaths = [
//     paths.verticalPaths[column],
//     paths.verticalPaths[column + 1],
//   ];

//   // Decompose the paths into segments.
//   const horizontalDecomposedPaths = horizontalPaths.map((path) =>
//     this.segmentsDecomposer(path)
//   );

//   const verticalDecomposedPaths = verticalPaths.map((path) =>
//     this.segmentsDecomposer(path)
//   );

//   // Will store the details of the segments of the enclosed curves. AKA the curves forming the puzzle piece.
//   const enclosedCurvesDetails: EnclosedCurvesDetails = {
//     top: [],
//     right: [],
//     bottom: [],
//     left: [],
//   };

//   // Get the details of the segments. Add to the coordinates the piece size. All paths are created from 0, 0. In reality the first would be the border.
//   const [topSegmentDetails, bottomSegmentDetails] = horizontalDecomposedPaths
//     .map((path) => this.getCurvesDetails(path, row))
//     .map((curvesDetails, i) => {
//       console.log('curvesDetails Pre');
//       console.log(JSON.stringify(curvesDetails, null, 2));
//       return curvesDetails.map((curveDetail) => {
//         const newCurveDetail = { ...curveDetail };
//         Object.entries(newCurveDetail).forEach(([_key, value]) => {
//           console.log('value', value);
//           console.log('row', row + 1);
//           value.x += pieceSize;
//           value.y += pieceSize * (row + 1 + i);
//         });
//         return newCurveDetail;
//       });
//     });

//   enclosedCurvesDetails.top = topSegmentDetails;

//   // Must reverse bottom segment to make it clockwise and a closed path.
//   const reversedBottomSegment = this.reverseSegment(bottomSegmentDetails);

//   enclosedCurvesDetails.bottom = reversedBottomSegment;

//   const [leftSegmentDetails, rightSegmentDetails] = verticalDecomposedPaths
//     .map((path) => this.getCurvesDetails(path, row))
//     .map((curvesDetails, i) => {
//       return curvesDetails.map((curveDetail) => {
//         Object.entries(curveDetail).forEach(([_key, value]) => {
//           value.x += pieceSize * (column + 1 + i);
//           value.y += pieceSize;
//         });
//         return curveDetail;
//       });
//     });

//   // Vertical paths need to be rotated 90 degrees since all paths are created from 0, 0 along x axis.
//   enclosedCurvesDetails.left = this.rotateSegment90(leftSegmentDetails);
//   enclosedCurvesDetails.right = this.rotateSegment90(rightSegmentDetails);

//   // Must reverse bottom segment to make it clockwise and a closed path.
//   enclosedCurvesDetails.left = this.reverseSegment(
//     enclosedCurvesDetails.left
//   );

//   console.log('top segment details');
//   console.log(topSegmentDetails);
//   console.log('enclosedCurvesDetails');
//   console.log(JSON.stringify(enclosedCurvesDetails.top, null, 2));

//   return enclosedCurvesDetails;
// }

// Get the path svg from the closed path
// static getPathSvg(segments: EnclosedCurvesDetails): string {
//   const close = 'Z';
//   const moveTo = `M ${segments.top[0].startPoint.x} ${segments.top[0].startPoint.y}`;

//   // Set callback for readability.
//   const firstCurve = (segment: SegmentDetails) =>
//     `C ${segment.controlPointStart.x} ${segment.controlPointStart.y} ${segment.controlPointEnd.x} ${segment.controlPointEnd.y} ${segment.endPoint.x} ${segment.endPoint.y}`;

//   const otherCurves = (segment: SegmentDetails) =>
//     `S ${segment.controlPointEnd.x} ${segment.controlPointEnd.y} ${segment.endPoint.x} ${segment.endPoint.y}`;

//   const curves: {
//     [key in keyof EnclosedCurvesDetails]: string;
//   } = {
//     top: '',
//     right: '',
//     bottom: '',
//     left: '',
//   };

//   // Reduce the segments using previous callbacks to a single path string.
//   Object.entries(segments).forEach(([key, segment]) => {
//     const curve = segment.reduce((acc, segment, i) => {
//       if (i === 0) return acc;
//       return acc + ' ' + otherCurves(segment);
//     }, firstCurve(segment[0]));

//     curves[key as keyof EnclosedCurvesDetails] = curve;
//   });

//   return `${moveTo} ${curves.top} ${curves.right} ${curves.bottom} ${curves.left} ${close}`;
// }
// }
