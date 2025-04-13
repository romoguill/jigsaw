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

  toCurves(paths: string[][]): Curve[] {
    const curves: Curve[] = [];
    const origin = { x: 0, y: 0 };

    paths.forEach((path) => {
      // If the path has 6 elements, it's a longhand cubic curve.
      if (path.length === 6) {
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
        const curve = new Curve({
          start: curves[curves.length - 1].endPoint, // The start point is the end point of the previous curve.
          end: {
            x: Number(path[2]),
            y: Number(path[3]),
          },
          controlStart: {
            x: curves[curves.length - 1].controlEndPoint.x, // The control start point is the control end point of the previous curve.
            y: curves[curves.length - 1].controlEndPoint.y,
          },
          controlEnd: {
            x: Number(path[2]),
            y: Number(path[3]),
          },
        });

        curves.push(curve);
      }
    });

    return curves;
  }
}
