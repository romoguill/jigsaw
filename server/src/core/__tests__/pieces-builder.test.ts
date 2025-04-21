import { Curve } from '../curve.js';
import { PiecesBuilder } from '../pieces-builder.js';

const horizontalPaths = [
  'M 0 0 C 76 -33 181 13 256 0 S 255 109 256 128 S 371 145 384 128 S 322 15 384 0 S 556 69 640 0',
  'M 0 0 C 79 -51 198 31 256 0 S 270 -119 256 -128 S 369 -133 384 -128 S 329 -10 384 0 S 560 19 640 0',
  'M 0 0 C 76 -33 181 13 256 0 S 255 109 256 128 S 371 145 384 128 S 322 15 384 0 S 556 69 640 0',
];

const verticalPaths = [
  'M 0 0 C 73 57 204 5 256 0 S 258 111 256 128 S 363 136 384 128 S 332 -4 384 0 S 568 58 640 0 S 824 -18 896 0 S 877 120 896 128 S 1028 144 1024 128 S 958 38 1024 0 S 1197 -29 1280 0',
  'M 0 0 C 46 75 188 27 256 0 S 256 105 256 128 S 391 146 384 128 S 337 -21 384 0 S 552 -59 640 0 S 843 -1 896 0 S 888 -109 896 -128 S 1031 -148 1024 -128 S 972 15 1024 0 S 1218 -65 1280 0',
];

const pieceSize = 640;

const paths = {
  horizontalPaths,
  verticalPaths,
};

describe('PiecesBuilder', () => {
  describe('constructor', () => {
    it('should initialize with provided paths', () => {
      const builder = new PiecesBuilder(paths);

      // Check instance.
      expect(builder).toBeInstanceOf(PiecesBuilder);
    });
  });

  describe('parsePath', () => {
    it('should parse a simple path with one complete segment', () => {
      const builder = new PiecesBuilder(paths);

      const result = builder.parsePaths();

      // The path has one segment, so we expect one array in the result
      expect(result.parsedHorizontalPaths.length).toBe(3);
      expect(result.parsedVerticalPaths.length).toBe(2);

      expect(result.parsedHorizontalPaths).toEqual([
        [
          [
            '76',
            '-33',
            '181',
            '13',
            '256',
            '0',
            '255',
            '109',
            '256',
            '128',
            '371',
            '145',
            '384',
            '128',
            '322',
            '15',
            '384',
            '0',
            '556',
            '69',
            '640',
            '0',
          ],
        ],
        [
          [
            '79',
            '-51',
            '198',
            '31',
            '256',
            '0',
            '270',
            '-119',
            '256',
            '-128',
            '369',
            '-133',
            '384',
            '-128',
            '329',
            '-10',
            '384',
            '0',
            '560',
            '19',
            '640',
            '0',
          ],
        ],
        [
          [
            '76',
            '-33',
            '181',
            '13',
            '256',
            '0',
            '255',
            '109',
            '256',
            '128',
            '371',
            '145',
            '384',
            '128',
            '322',
            '15',
            '384',
            '0',
            '556',
            '69',
            '640',
            '0',
          ],
        ],
      ]);
    });

    it('should parse a path with multiple segments', () => {
      const builder = new PiecesBuilder(paths);

      const result = builder.parsePaths();

      expect(result.parsedHorizontalPaths.length).toBe(3);
      expect(result.parsedVerticalPaths.length).toBe(2);

      expect(result.parsedVerticalPaths).toEqual([
        [
          [
            '73',
            '57',
            '204',
            '5',
            '256',
            '0',
            '258',
            '111',
            '256',
            '128',
            '363',
            '136',
            '384',
            '128',
            '332',
            '-4',
            '384',
            '0',
            '568',
            '58',
            '640',
            '0',
          ],
          [
            '824',
            '-18',
            '896',
            '0',
            '877',
            '120',
            '896',
            '128',
            '1028',
            '144',
            '1024',
            '128',
            '958',
            '38',
            '1024',
            '0',
            '1197',
            '-29',
            '1280',
            '0',
          ],
        ],
        [
          [
            '46',
            '75',
            '188',
            '27',
            '256',
            '0',
            '256',
            '105',
            '256',
            '128',
            '391',
            '146',
            '384',
            '128',
            '337',
            '-21',
            '384',
            '0',
            '552',
            '-59',
            '640',
            '0',
          ],
          [
            '843',
            '-1',
            '896',
            '0',
            '888',
            '-109',
            '896',
            '-128',
            '1031',
            '-148',
            '1024',
            '-128',
            '972',
            '15',
            '1024',
            '0',
            '1218',
            '-65',
            '1280',
            '0',
          ],
        ],
      ]);
    });

    it('should handle invalid paths without move command', () => {
      const modifiedHorizontalPaths = [...horizontalPaths];
      modifiedHorizontalPaths[0] = modifiedHorizontalPaths[0].slice(1);

      const pathsModified = {
        ...paths,
        horizontalPaths: modifiedHorizontalPaths,
      };
      const builder = new PiecesBuilder(pathsModified);

      expect(() => builder.parsePaths()).toThrowError('Invalid path');
    });

    it('should handle paths with incorrect length', () => {
      const modifiedHorizontalPaths = [...horizontalPaths];
      modifiedHorizontalPaths[1] = modifiedHorizontalPaths[1].slice(1, 2);

      const pathsModified = {
        ...paths,
        horizontalPaths: modifiedHorizontalPaths,
      };
      const builder = new PiecesBuilder(pathsModified);

      expect(() => builder.parsePaths()).toThrow();
    });
  });

  describe('toCurves', () => {
    it('should convert path segments to curves', () => {
      const builder = new PiecesBuilder(paths);
      const { parsedHorizontalPaths } = builder.parsePaths();

      const horizontalCurves = builder.toCurves(parsedHorizontalPaths[0]);

      expect(horizontalCurves[0][0].startPoint).toEqual({ x: 0, y: 0 });
      expect(horizontalCurves[0][0].endPoint).toEqual({ x: 256, y: 0 });
      expect(horizontalCurves[0][0].controlStartPoint).toEqual({
        x: 76,
        y: -33,
      });
      expect(horizontalCurves[0][0].controlEndPoint).toEqual({ x: 181, y: 13 });

      expect(horizontalCurves[0][1].startPoint).toEqual({ x: 256, y: 0 });
      expect(horizontalCurves[0][1].endPoint).toEqual({ x: 256, y: 128 });
      // Control point = start point + (start point - previous control end point)
      expect(horizontalCurves[0][1].controlStartPoint).toEqual({
        x:
          horizontalCurves[0][1].startPoint.x +
          (horizontalCurves[0][1].startPoint.x -
            horizontalCurves[0][0].controlEndPoint.x),
        y:
          horizontalCurves[0][1].startPoint.y +
          (horizontalCurves[0][1].startPoint.y -
            horizontalCurves[0][0].controlEndPoint.y),
      });
      expect(horizontalCurves[0][1].controlEndPoint).toEqual({
        x: 255,
        y: 109,
      });

      expect(horizontalCurves[0][2].startPoint).toEqual({ x: 256, y: 128 });
      expect(horizontalCurves[0][2].endPoint).toEqual({ x: 384, y: 128 });
      expect(horizontalCurves[0][2].controlStartPoint).toEqual({
        x:
          horizontalCurves[0][2].startPoint.x +
          (horizontalCurves[0][2].startPoint.x -
            horizontalCurves[0][1].controlEndPoint.x),
        y:
          horizontalCurves[0][2].startPoint.y +
          (horizontalCurves[0][2].startPoint.y -
            horizontalCurves[0][1].controlEndPoint.y),
      });
      expect(horizontalCurves[0][2].controlEndPoint).toEqual({
        x: 371,
        y: 145,
      });

      expect(horizontalCurves[0][3].startPoint).toEqual({ x: 384, y: 128 });
      expect(horizontalCurves[0][3].endPoint).toEqual({ x: 384, y: 0 });
      expect(horizontalCurves[0][3].controlStartPoint).toEqual({
        x:
          horizontalCurves[0][3].startPoint.x +
          (horizontalCurves[0][3].startPoint.x -
            horizontalCurves[0][2].controlEndPoint.x),
        y:
          horizontalCurves[0][3].startPoint.y +
          (horizontalCurves[0][3].startPoint.y -
            horizontalCurves[0][2].controlEndPoint.y),
      });
      expect(horizontalCurves[0][3].controlEndPoint).toEqual({
        x: 322,
        y: 15,
      });

      expect(horizontalCurves[0][4].startPoint).toEqual({ x: 384, y: 0 });
      expect(horizontalCurves[0][4].endPoint).toEqual({ x: 640, y: 0 });
      expect(horizontalCurves[0][4].controlStartPoint).toEqual({
        x:
          horizontalCurves[0][4].startPoint.x +
          (horizontalCurves[0][4].startPoint.x -
            horizontalCurves[0][3].controlEndPoint.x),
        y:
          horizontalCurves[0][4].startPoint.y +
          (horizontalCurves[0][4].startPoint.y -
            horizontalCurves[0][3].controlEndPoint.y),
      });
      expect(horizontalCurves[0][4].controlEndPoint).toEqual({
        x: 556,
        y: 69,
      });
    });

    it('should handle multiple path segments', () => {
      const builder = new PiecesBuilder(paths);
      const { parsedVerticalPaths } = builder.parsePaths();

      const verticalCurves = builder.toCurves(parsedVerticalPaths[0]);

      // First segment
      expect(verticalCurves[0][0].startPoint).toEqual({ x: 0, y: 0 });
      expect(verticalCurves[0][0].endPoint).toEqual({ x: 256, y: 0 });
      expect(verticalCurves[0][0].controlStartPoint).toEqual({
        x: 73,
        y: 57,
      });
      expect(verticalCurves[0][0].controlEndPoint).toEqual({ x: 204, y: 5 });

      expect(verticalCurves[0][1].startPoint).toEqual({ x: 256, y: 0 });
      expect(verticalCurves[0][1].endPoint).toEqual({ x: 256, y: 128 });
      expect(verticalCurves[0][1].controlStartPoint).toEqual({
        x:
          verticalCurves[0][1].startPoint.x +
          (verticalCurves[0][1].startPoint.x -
            verticalCurves[0][0].controlEndPoint.x),
        y:
          verticalCurves[0][1].startPoint.y +
          (verticalCurves[0][1].startPoint.y -
            verticalCurves[0][0].controlEndPoint.y),
      });
      expect(verticalCurves[0][1].controlEndPoint).toEqual({
        x: 258,
        y: 111,
      });

      expect(verticalCurves[0][2].startPoint).toEqual({ x: 256, y: 128 });
      expect(verticalCurves[0][2].endPoint).toEqual({ x: 384, y: 128 });
      expect(verticalCurves[0][2].controlStartPoint).toEqual({
        x:
          verticalCurves[0][2].startPoint.x +
          (verticalCurves[0][2].startPoint.x -
            verticalCurves[0][1].controlEndPoint.x),
        y:
          verticalCurves[0][2].startPoint.y +
          (verticalCurves[0][2].startPoint.y -
            verticalCurves[0][1].controlEndPoint.y),
      });
      expect(verticalCurves[0][2].controlEndPoint).toEqual({
        x: 363,
        y: 136,
      });

      expect(verticalCurves[0][3].startPoint).toEqual({ x: 384, y: 128 });
      expect(verticalCurves[0][3].endPoint).toEqual({ x: 384, y: 0 });
      expect(verticalCurves[0][3].controlStartPoint).toEqual({
        x:
          verticalCurves[0][3].startPoint.x +
          (verticalCurves[0][3].startPoint.x -
            verticalCurves[0][2].controlEndPoint.x),
        y:
          verticalCurves[0][3].startPoint.y +
          (verticalCurves[0][3].startPoint.y -
            verticalCurves[0][2].controlEndPoint.y),
      });
      expect(verticalCurves[0][3].controlEndPoint).toEqual({
        x: 332,
        y: -4,
      });

      expect(verticalCurves[0][4].startPoint).toEqual({ x: 384, y: 0 });
      expect(verticalCurves[0][4].endPoint).toEqual({ x: 640, y: 0 });
      expect(verticalCurves[0][4].controlStartPoint).toEqual({
        x:
          verticalCurves[0][4].startPoint.x +
          (verticalCurves[0][4].startPoint.x -
            verticalCurves[0][3].controlEndPoint.x),
        y:
          verticalCurves[0][4].startPoint.y +
          (verticalCurves[0][4].startPoint.y -
            verticalCurves[0][3].controlEndPoint.y),
      });
      expect(verticalCurves[0][4].controlEndPoint).toEqual({
        x: 568,
        y: 58,
      });
    });

    it('should handle empty path segments', () => {
      const builder = new PiecesBuilder(paths);
      const pathSegments: string[][] = [];

      const curves = builder.toCurves(pathSegments);

      expect(curves.length).toBe(0);
    });
  });

  describe('getAllCurves', () => {
    it('should return both horizontal and vertical curves', () => {
      const builder = new PiecesBuilder(paths);
      const result = builder.generateAllCurves();

      // Check that we have the expected number of paths
      expect(result.horizontalCurves.length).toBe(3);
      expect(result.verticalCurves.length).toBe(2);

      // Check the first horizontal path
      expect(result.horizontalCurves[0].length).toBe(1);
      expect(result.horizontalCurves[0][0].length).toBe(5);

      // Check the first vertical path
      expect(result.verticalCurves[0].length).toBe(2);
      expect(result.verticalCurves[0][0].length).toBe(5);

      // Verify the first curve of the first horizontal path
      expect(result.horizontalCurves[1][0][0].startPoint).toEqual({
        x: 0,
        y: 0 + pieceSize * 2,
      });
      expect(result.horizontalCurves[1][0][0].endPoint).toEqual({
        x: 256,
        y: 0 + pieceSize * 2,
      });
      expect(result.horizontalCurves[1][0][0].controlStartPoint).toEqual({
        x: 79,
        y: -51 + pieceSize * 2,
      });
      expect(result.horizontalCurves[1][0][0].controlEndPoint).toEqual({
        x: 198,
        y: 31 + pieceSize * 2,
      });

      // Verify the first curve of the first vertical path
      expect(result.verticalCurves[1][1][1].startPoint).toEqual({
        x: 896 + pieceSize * 2,
        y: 0,
      });
      expect(result.verticalCurves[1][1][1].endPoint).toEqual({
        x: 896 + pieceSize * 2,
        y: -128,
      });
      expect(result.verticalCurves[1][1][1].controlStartPoint).toEqual({
        x:
          result.verticalCurves[1][1][1].startPoint.x +
          (result.verticalCurves[1][1][1].startPoint.x -
            result.verticalCurves[1][1][0].controlEndPoint.x),
        y:
          result.verticalCurves[1][1][1].startPoint.y +
          (result.verticalCurves[1][1][1].startPoint.y -
            result.verticalCurves[1][1][0].controlEndPoint.y),
      });
      expect(result.verticalCurves[1][1][1].controlEndPoint).toEqual({
        x: 888 + pieceSize * 2,
        y: -109,
      });
    });
  });

  describe('getPieceSize', () => {
    it('should return the correct piece size', () => {
      const builder = new PiecesBuilder(paths);
      builder.parsePaths();

      expect(builder.pieceSize).toBe(640);
    });
  });

  describe('getEncolisingCurves', () => {
    it('should return the correct curves for a piece in the second row and first column', () => {
      const builder = new PiecesBuilder(paths);

      builder.generateAllCurves();

      builder.applyRotationToVerticalCurves();

      const result = builder.getEncolisingCurves(1, 0);

      // Verify the segments are the correct ones
      expect(result.topSegment).toBe(builder.horizontalCurves[0][0]);
      expect(result.bottomSegment).toBe(builder.horizontalCurves[1][0]);
      expect(result.leftSegment).toBe(null);
      expect(result.rightSegment).toBe(builder.verticalCurves[0][1]);
    });

    it('should handle corner pieces', () => {
      const builder = new PiecesBuilder(paths);
      builder.generateAllCurves();

      // We need to check for the last column
      const resultLastColumn = builder.getEncolisingCurves(0, 0);

      expect(resultLastColumn.topSegment).toBeNull();
      expect(resultLastColumn.bottomSegment).toBe(
        builder.horizontalCurves[0][0]
      );
      expect(resultLastColumn.leftSegment).toBeNull();
      expect(resultLastColumn.rightSegment).toBe(builder.verticalCurves[0][0]);
    });
  });

  describe('applyRotationToVerticalCurves', () => {
    it('should rotate all vertical curves 90 degrees clockwise', () => {
      const builder = new PiecesBuilder(paths);

      builder.generateAllCurves();

      // Store original coordinates for comparison
      const originalCoordinates = builder.verticalCurves.map((segments) =>
        segments.map((segment) =>
          segment.map(
            (curve) =>
              new Curve({
                start: { ...curve.startPoint },
                end: { ...curve.endPoint },
                controlStart: { ...curve.controlStartPoint },
                controlEnd: { ...curve.controlEndPoint },
              })
          )
        )
      );

      // Apply rotation
      builder.applyRotationToVerticalCurves();

      // Check that each curve has been rotated 90 degrees clockwise
      builder.verticalCurves.forEach((segments, segmentIndex) => {
        segments.forEach((segment, curveIndex) => {
          const rotationOrigin = segments[0][0].startPoint;
          segment.forEach((curve, i) => {
            const original = originalCoordinates[segmentIndex][curveIndex][i];
            original.rotate90Clockwise(rotationOrigin);

            expect(curve.startPoint.x).toBeCloseTo(original.startPoint.x, 10);
            expect(curve.startPoint.y).toBeCloseTo(original.startPoint.y, 10);

            expect(curve.endPoint.x).toBeCloseTo(original.endPoint.x, 10);
            expect(curve.endPoint.y).toBeCloseTo(original.endPoint.y, 10);

            expect(curve.controlStartPoint.x).toBeCloseTo(
              original.controlStartPoint.x,
              1
            );
            expect(curve.controlStartPoint.y).toBeCloseTo(
              original.controlStartPoint.y,
              1
            );

            expect(curve.controlEndPoint.x).toBeCloseTo(
              original.controlEndPoint.x,
              1
            );
            expect(curve.controlEndPoint.y).toBeCloseTo(
              original.controlEndPoint.y,
              1
            );
          });
        });
      });
    });

    it('should rotate curves around their starting point', () => {
      const builder = new PiecesBuilder(paths);
      builder.generateAllCurves();

      // Get the first curve of the first segment of the first vertical path
      const firstCurve = builder.verticalCurves[0][0][0];
      const startPoint = { ...firstCurve.startPoint };

      // Apply rotation
      builder.applyRotationToVerticalCurves();

      // The start point should remain the same after rotation
      expect(builder.verticalCurves[0][0][0].startPoint.x).toBe(startPoint.x);
      expect(builder.verticalCurves[0][0][0].startPoint.y).toBe(startPoint.y);
    });

    it('should handle empty vertical curves', () => {
      const emptyPaths = {
        horizontalPaths: [...horizontalPaths],
        verticalPaths: [],
      };
      const builder = new PiecesBuilder(emptyPaths);
      builder.generateAllCurves();

      // This should not throw an error
      expect(() => builder.applyRotationToVerticalCurves()).not.toThrow();
    });
  });
});
