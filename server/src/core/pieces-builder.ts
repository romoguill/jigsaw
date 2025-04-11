export class PiecesBuilder {
  // Horizontal and vertical paths
  private paths: {
    horizontalPaths: string[];
    verticalPaths: string[];
  };

  constructor(paths: { horizontalPaths: string[]; verticalPaths: string[] }) {
    this.paths = paths;
  }

  //
  parsePath(path: string): string[][] {
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

    return completeSegments;
  }
}
