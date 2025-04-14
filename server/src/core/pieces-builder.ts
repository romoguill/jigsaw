import { Curve } from './curve.js';

export class PiecesBuilder {
  // Horizontal and vertical paths
  private paths: {
    horizontalPaths: string[];
    verticalPaths: string[];
  };

  constructor(paths: { horizontalPaths: string[]; verticalPaths: string[] }) {
    this.paths = paths;
  }

  private parsePath(path: string): string[][] {
    if (path.slice(0, 5) !== 'M 0 0') {
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

    return { parsedHorizontalPaths, parsedVerticalPaths };
  }

  toCurves(paths: string[][]): Curve[][] {
    const allCurves: Curve[][] = [];
    const origin = { x: 0, y: 0 };
    let remainingSegments: string[] = [];

    paths.forEach((path, i) => {
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
          console.log('curves', curves);
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
        console.log('remainingSegments', remainingSegments);
        const curve = new Curve({
          start: curves[curves.length - 1].endPoint, // The start point is the end point of the previous curve.
          end: {
            x: Number(remainingSegments[2]),
            y: Number(remainingSegments[3]),
          },
          controlStart: {
            x: curves[curves.length - 1].controlEndPoint.x, // The control start point is the control end point of the previous curve.
            y: curves[curves.length - 1].controlEndPoint.y,
          },
          controlEnd: {
            x: Number(remainingSegments[0]),
            y: Number(remainingSegments[1]),
          },
        });

        console.log('curve', curve);

        curves.push(curve);
        remainingSegments = remainingSegments.slice(4);
      }

      allCurves.push(curves);
    });

    return allCurves;
  }
}
