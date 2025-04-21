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
            controlStart: Curve.calculateControlStart(
              lastCurve,
              lastCurve.endPoint
            ),
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
          : new Curve({
              start: origin,
              end: origin,
              controlStart: origin,
              controlEnd: origin,
            });

        const curve = new Curve({
          start: curves[curves.length - 1]
            ? curves[curves.length - 1].endPoint
            : lastCurve.endPoint, // The start point is the end point of the previous curve.
          end: {
            x: Number(remainingSegments[2]),
            y: Number(remainingSegments[3]),
          },
          controlStart: curves[curves.length - 1]
            ? Curve.calculateControlStart(
                curves[curves.length - 1],
                curves[curves.length - 1].endPoint
              )
            : Curve.calculateControlStart(lastCurve, lastCurve.endPoint),
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
      row === 0 ? null : this.horizontalCurves[row - 1]?.[column];
    const bottomSegment: Curve[] | null =
      this.horizontalCurves[row]?.[column] ?? null;
    const leftSegment: Curve[] | null =
      column === 0 ? null : this.verticalCurves[column - 1]?.[row];
    const rightSegment: Curve[] | null =
      this.verticalCurves[column]?.[row] ?? null;

    return { topSegment, bottomSegment, leftSegment, rightSegment };
  }

  applyRotationToVerticalCurves(): void {
    // Rotate the curves 90 degrees clockwise. Use the first curve of the first segment of each vertical curve as the rotation origin.
    this._verticalCurves.forEach((segments) => {
      const rotationOrigin = segments[0][0].startPoint;
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
      // Create a deep copy of the bottom segment by creating new Curve instances
      const bottomSegmentCopy = bottomSegment.map((curve) => {
        return curve.clone();
      });
      // Reverse order of curves
      reversedBottomSegment = bottomSegmentCopy.reverse();
      // Reverse the direction of the curves
      reversedBottomSegment.forEach((curve) => {
        curve.reverse();
      });
    }

    let reversedLeftSegment: Curve[] | null = null;
    if (leftSegment) {
      // Create a deep copy of the left segment by creating new Curve instances
      const leftSegmentCopy = leftSegment.map((curve) => {
        return curve.clone();
      });
      // Reverse order of curves
      reversedLeftSegment = leftSegmentCopy.reverse();
      // Reverse the direction of the curves
      reversedLeftSegment.forEach((curve) => {
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

  // Generate the SVG path for the border of a piece. Basically a straight line to the end point.
  static borderSvgPath(endPoint: Coordinate) {
    return `L ${endPoint.x} ${endPoint.y}`;
  }

  // Final output of the enclosed shape. Pure SVG string.
  enclosedShapeToSvg(
    svgPaths: (string[] | null)[],
    row: number,
    column: number
  ) {
    const origin = { x: column * this._pieceSize, y: row * this._pieceSize };
    const moveToCommand = `M ${origin.x} ${origin.y}`;
    const closePathCommand = 'Z';

    const svgPath = svgPaths.map((segment, i) => {
      // If the segment is null, it means that the piece is on the border.
      // So if the top segment (first element of the segment array) is null, the svg must be a horizontal border, with the endpoint located at the right of the piece. Same for all others.
      if (!segment) {
        // Top border
        if (row === 0 && i === 0) {
          return [
            PiecesBuilder.borderSvgPath({
              x: origin.x + this._pieceSize,
              y: origin.y,
            }),
          ];
        }

        // Bottom border
        if (row === this._horizontalCurves.length && i === 2) {
          return [
            PiecesBuilder.borderSvgPath({
              x: origin.x,
              y: origin.y + this._pieceSize,
            }),
          ];
        }

        // Left border
        if (column === 0 && i === 4) {
          return [
            PiecesBuilder.borderSvgPath({
              x: origin.x,
              y: origin.y,
            }),
          ];
        }

        // Right border
        if (column === this._verticalCurves.length && i === 1) {
          return [
            PiecesBuilder.borderSvgPath({
              x: origin.x + this._pieceSize,
              y: origin.y + this._pieceSize,
            }),
          ];
        }

        // Should never happen. If segment is null, it means that the piece is on the border.
        return [];
      } else {
        return segment;
      }
    });

    // Join the initial moveToCommand with the svg paths and the closePathCommand.
    return [
      moveToCommand,
      ...svgPath.map((path) => path.join(' ')),
      closePathCommand,
    ].join(' ');
  }
}
