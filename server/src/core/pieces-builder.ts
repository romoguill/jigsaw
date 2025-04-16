import type { Coordinate } from '@jigsaw/shared/schemas';
import { Curve } from './curve.js';

export class PiecesBuilder {
  // Horizontal and vertical paths
  private paths: {
    horizontalPaths: string[];
    verticalPaths: string[];
  };
  private _horizontalCurves: Curve[][][] = [];
  private _verticalCurves: Curve[][][] = [];
  private _pieceSize: number = 0;

  constructor(paths: { horizontalPaths: string[]; verticalPaths: string[] }) {
    this.paths = paths;
  }

  private parsePath(path: string): string[][] {
    if (path.slice(0, 5) !== 'M 0 0') {
      console.log('error');
      throw new Error('Invalid path');
    }

    // Get the path segments without the M, C or S. Remove the first element because it's the MoveTo command.
    const pathArray = path.split(/[CS]/).slice(1);

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

    // If there are any partial segments left, the path is invalid.
    if (partialSegments.length > 0) {
      throw new Error('Invalid path');
    }

    return completeSegments;
  }

  parsePaths() {
    const parsedHorizontalPaths = this.paths.horizontalPaths.map((path) =>
      this.parsePath(path)
    );

    const parsedVerticalPaths = this.paths.verticalPaths.map((path) =>
      this.parsePath(path)
    );

    // Use the first horizontal curve to infer the piece size.
    this._pieceSize = Number(parsedHorizontalPaths[0][0][20]);

    return { parsedHorizontalPaths, parsedVerticalPaths };
  }

  get pieceSize() {
    return this._pieceSize;
  }

  toCurves(paths: string[][]): Curve[][] {
    const allCurves: Curve[][] = [];
    const origin = { x: 0, y: 0 };

    paths.forEach((path, i) => {
      let remainingSegments: string[] = path;
      const curves: Curve[] = [];

      if (i === 0) {
        if (path.length === 22) {
          const curve = new Curve({
            start: origin,
            end: {
              x: Number(path[4]),
              y: Number(path[5]),
            },
            controlStart: {
              x: Number(path[0]),
              y: Number(path[1]),
            },
            controlEnd: {
              x: Number(path[2]),
              y: Number(path[3]),
            },
          });

          curves.push(curve);
        } else {
          const lastSegment = allCurves[allCurves.length - 1];
          const lastCurve = lastSegment[lastSegment.length - 1];

          const curve = new Curve({
            start: lastCurve.endPoint,
            end: {
              x: Number(path[2]),
              y: Number(path[3]),
            },
            controlStart: {
              x: lastCurve.controlEndPoint.x,
              y: lastCurve.controlEndPoint.y,
            },
            controlEnd: {
              x: Number(path[0]),
              y: Number(path[1]),
            },
          });

          curves.push(curve);
        }

        // Get the remaining segments from the path without the first curve
        remainingSegments = path.slice(6);
      }

      while (remainingSegments.length > 0) {
        const lastSegment = allCurves[allCurves.length - 1];
        // Default just to please the type checker. Should never happen.
        const lastCurve = lastSegment
          ? lastSegment[lastSegment.length - 1]
          : {
              startPoint: origin,
              endPoint: origin,
              controlStartPoint: origin,
              controlEndPoint: origin,
            };

        const curve = new Curve({
          start: curves[curves.length - 1]
            ? curves[curves.length - 1].endPoint
            : lastCurve.endPoint, // The start point is the end point of the previous curve.
          end: {
            x: Number(remainingSegments[2]),
            y: Number(remainingSegments[3]),
          },
          controlStart: curves[curves.length - 1]
            ? curves[curves.length - 1].controlEndPoint
            : lastCurve.controlEndPoint,
          controlEnd: {
            x: Number(remainingSegments[0]),
            y: Number(remainingSegments[1]),
          },
        });

        curves.push(curve);
        remainingSegments = remainingSegments.slice(4);
      }

      allCurves.push(curves);
    });

    return allCurves;
  }

  generateAllCurves() {
    const { parsedHorizontalPaths, parsedVerticalPaths } = this.parsePaths();
    this._horizontalCurves = parsedHorizontalPaths.map((path, i) => {
      const segments = this.toCurves(path);

      // Move each segment to the bottom of the previous one by the piece size.
      segments.forEach((segment) => {
        segment.forEach((curve) => {
          curve.translate(0, this._pieceSize * (i + 1));
        });
      });

      return segments;
    });

    this._verticalCurves = parsedVerticalPaths.map((path, i) => {
      const segments = this.toCurves(path);

      // Move each segment to the right of the previous one by the piece size.
      segments.forEach((segment) => {
        segment.forEach((curve) => {
          curve.translate(this._pieceSize * (i + 1), 0);
        });
      });

      return segments;
    });

    return {
      horizontalCurves: this._horizontalCurves,
      verticalCurves: this._verticalCurves,
    };
  }

  get horizontalCurves() {
    // Memoize all curves
    if (this._horizontalCurves.length === 0) {
      this.generateAllCurves();
    }

    return this._horizontalCurves;
  }

  get verticalCurves() {
    // Memoize all curves
    if (this._verticalCurves.length === 0) {
      this.generateAllCurves();
    }

    return this._verticalCurves;
  }

  // Get from the puzzle grid the curves around a piece.
  // It's important to note that border must be taken into account. If the piece is on the border, some segments will be null.
  getEncolisingCurves(
    row: number,
    column: number
  ): {
    topSegment: Curve[] | null;
    bottomSegment: Curve[] | null;
    leftSegment: Curve[] | null;
    rightSegment: Curve[] | null;
  } {
    const topSegment: Curve[] | null =
      row === 0 ? null : this.horizontalCurves[row - 1][column];
    const bottomSegment: Curve[] | null =
      this.horizontalCurves[row][column] ?? null;
    const leftSegment: Curve[] | null =
      column === 0 ? null : this.verticalCurves[column - 1][row];
    const rightSegment: Curve[] | null =
      this.verticalCurves[column][row] ?? null;

    return { topSegment, bottomSegment, leftSegment, rightSegment };
  }

  applyRotationToVerticalCurves(): void {
    // Rotate the curves 90 degrees clockwise. Use the first curve of the first segment of each vertical curve as the rotation origin.
    this._verticalCurves.forEach((segments) => {
      const rotationOrigin = segments[0][0].startPoint;
      console.log(rotationOrigin);
      segments.forEach((segment) => {
        segment.forEach((curve) => {
          curve.rotate90Clockwise(rotationOrigin);
        });
      });
    });
  }

  // Generate the piece shape by using the enclosing curves to build the shape.
  generateEnclosingShape(row: number, column: number) {
    const { topSegment, bottomSegment, leftSegment, rightSegment } =
      this.getEncolisingCurves(row, column);

    let reversedBottomSegment: Curve[] | null = null;
    // Have to invert the bottom and left segment for a closed clockwise shape.
    if (bottomSegment) {
      // Reverse order of curves
      reversedBottomSegment = bottomSegment.reverse();
      // Reverse the direction of the curves
      bottomSegment.forEach((curve) => {
        curve.reverse();
      });
    }

    let reversedLeftSegment: Curve[] | null = null;
    if (leftSegment) {
      // Reverse order of curves
      reversedLeftSegment = leftSegment.reverse();
      // Reverse the direction of the curves
      leftSegment.forEach((curve) => {
        curve.reverse();
      });
    }

    // Join the segments
    const shape = [
      topSegment,
      rightSegment,
      reversedBottomSegment,
      reversedLeftSegment,
    ];

    return shape;
  }

  // Convert the enclosed shape curves to an array of SVG paths.
  enclosedShapeToSvgPaths(segments: (Curve[] | null)[]) {
    const svg = segments.map((segment) => {
      if (!segment) return null;
      return segment.map((segment, i) => {
        if (i === 0) {
          return segment.toSvgLonghand();
        }
        return segment.toSvgShorthand();
      });
    });

    return svg;
  }

  // Generate the SVG path for the border of a piece. Basically a straight line from the start point to the end point.
  static borderSvgPath(endPoint: Coordinate) {
    return `L ${endPoint.x} ${endPoint.y}`;
  }

  // Final output of the enclosed shape. Pure SVG string.
  enclosedShapeToSvg(segments: (Curve[] | null)[]) {
    const moveTo = `M ${segments[0][0].startPoint.x} ${segments[0][0].startPoint.y}`;
    const svgPaths = this.enclosedShapeToSvgPaths(segments);

    return svgPaths.map((path) => path.join(' ')).join(' ');
  }
}
