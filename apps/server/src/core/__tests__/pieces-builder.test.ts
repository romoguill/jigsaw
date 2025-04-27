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

// Visually checked game that works.
const completeGamePaths = {
  horizontalPaths: [
    'M 0 0 C 53 5 130 -20 171 0 S 161 -86 171 -85 S 253 -98 256 -85 S 210 12 256 0 S 390 -57 427 0 S 555 16 598 0 S 611 77 598 85 S 692 96 683 85 S 643 5 683 0 S 795 -31 854 0 S 992 11 1025 0 S 1018 -75 1025 -85 S 1117 -95 1110 -85 S 1061 8 1110 0 S 1242 -58 1281 0 S 1408 -22 1452 0 S 1448 74 1452 85 S 1543 93 1537 85 S 1492 -7 1537 0 S 1659 -46 1708 0',
    'M 0 0 C 50 -20 127 3 171 0 S 166 73 171 85 S 245 85 256 85 S 218 22 256 0 S 365 -5 427 0 S 559 -8 598 0 S 601 70 598 85 S 681 97 683 85 S 647 11 683 0 S 781 -6 854 0 S 978 -7 1025 0 S 1013 -77 1025 -85 S 1115 -100 1110 -85 S 1075 19 1110 0 S 1231 28 1281 0 S 1403 0 1452 0 S 1438 81 1452 85 S 1538 97 1537 85 S 1487 5 1537 0 S 1666 62 1708 0',
  ],
  verticalPaths: [
    'M 0 0 C 44 -37 128 0 171 0 S 156 84 171 85 S 245 88 256 85 S 223 -17 256 0 S 374 14 427 0 S 564 -12 598 0 S 591 -73 598 -85 S 670 -93 683 -85 S 638 1 683 0 S 792 -9 854 0 S 975 6 1025 0 S 1015 73 1025 85 S 1099 83 1110 85 S 1077 15 1110 0 S 1208 16 1281 0',
    'M 0 0 C 54 -5 131 10 171 0 S 175 74 171 85 S 244 86 256 85 S 210 -14 256 0 S 373 -28 427 0 S 555 23 598 0 S 604 -76 598 -85 S 685 -99 683 -85 S 638 5 683 0 S 795 -38 854 0 S 977 18 1025 0 S 1023 74 1025 85 S 1111 96 1110 85 S 1072 12 1110 0 S 1228 -5 1281 0',
    'M 0 0 C 54 -2 127 1 171 0 S 161 -84 171 -85 S 242 -88 256 -85 S 215 -5 256 0 S 374 -20 427 0 S 557 8 598 0 S 606 78 598 85 S 690 97 683 85 S 637 5 683 0 S 818 51 854 0 S 989 9 1025 0 S 1010 -88 1025 -85 S 1119 -93 1110 -85 S 1075 -2 1110 0 S 1226 21 1281 0',
  ],
};

describe('PiecesBuilder', () => {
  describe('constructor', () => {
    it('should initialize with provided paths', () => {
      const builder = new PiecesBuilder(paths, pieceSize);

      // Check instance.
      expect(builder).toBeInstanceOf(PiecesBuilder);
    });
  });

  describe('parsePath', () => {
    it('should parse a simple path with one complete segment', () => {
      const builder = new PiecesBuilder(paths, pieceSize);

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
      const builder = new PiecesBuilder(paths, pieceSize);

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
      const builder = new PiecesBuilder(pathsModified, pieceSize);

      expect(() => builder.parsePaths()).toThrowError('Invalid path');
    });

    it('should handle paths with incorrect length', () => {
      const modifiedHorizontalPaths = [...horizontalPaths];
      modifiedHorizontalPaths[1] = modifiedHorizontalPaths[1].slice(1, 2);

      const pathsModified = {
        ...paths,
        horizontalPaths: modifiedHorizontalPaths,
      };
      const builder = new PiecesBuilder(pathsModified, pieceSize);

      expect(() => builder.parsePaths()).toThrow();
    });
  });

  describe('toCurves', () => {
    it('should convert path segments to curves', () => {
      const builder = new PiecesBuilder(paths, pieceSize);
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
      const builder = new PiecesBuilder(paths, pieceSize);
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
      const builder = new PiecesBuilder(paths, pieceSize);
      const pathSegments: string[][] = [];

      const curves = builder.toCurves(pathSegments);

      expect(curves.length).toBe(0);
    });
  });

  describe('getAllCurves', () => {
    it('should return both horizontal and vertical curves', () => {
      const builder = new PiecesBuilder(paths, pieceSize);
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
      const builder = new PiecesBuilder(paths, pieceSize);
      builder.parsePaths();

      expect(builder.pieceSize).toBe(640);
    });
  });

  describe('getEnclosedCurves', () => {
    it('should return the correct curves for a piece in the second row and first column', () => {
      const builder = new PiecesBuilder(paths, pieceSize);

      builder.generateAllCurves();

      builder.applyRotationToVerticalCurves();

      const result = builder.getEnclosedCurves(1, 0);

      // Verify the segments are the correct ones
      expect(result.topSegment).toBe(builder.horizontalCurves[0][0]);
      expect(result.bottomSegment).toBe(builder.horizontalCurves[1][0]);
      expect(result.leftSegment).toBe(null);
      expect(result.rightSegment).toBe(builder.verticalCurves[0][1]);
    });

    it('should handle corner pieces', () => {
      const builder = new PiecesBuilder(paths, pieceSize);
      builder.generateAllCurves();

      // We need to check for the last column
      const resultLastColumn = builder.getEnclosedCurves(0, 0);

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
      const builder = new PiecesBuilder(paths, pieceSize);

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
      const builder = new PiecesBuilder(paths, pieceSize);
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
      const builder = new PiecesBuilder(emptyPaths, pieceSize);
      builder.generateAllCurves();

      // This should not throw an error
      expect(() => builder.applyRotationToVerticalCurves()).not.toThrow();
    });
  });

  describe('generateEnclosedShape', () => {
    it('should generate enclosed shape for a piece in the middle of the grid', () => {
      const builder = new PiecesBuilder(paths, pieceSize);
      builder.generateAllCurves();
      builder.applyRotationToVerticalCurves();

      const shape = builder.generateEnclosedShape(1, 1);

      expect(shape).toHaveLength(4); // Check that all 4 sides are present
      expect(shape[0]).toBe(builder.horizontalCurves[0][1]); // top segment
      expect(shape[1]).toBe(builder.verticalCurves[1][1]); // right segment
      expect(shape[2]).not.toBe(builder.horizontalCurves[1][1]); // bottom segment should be reversed
      expect(shape[3]).not.toBe(builder.verticalCurves[0][1]); // left segment should be reversed

      // Check that bottom and left segments are reversed
      const bottomSegment = shape[2];
      const leftSegment = shape[3];

      if (bottomSegment && leftSegment) {
        // Check that the curves are in reverse order
        expect(bottomSegment[0].startPoint).toEqual(
          builder.horizontalCurves[1][1][
            builder.horizontalCurves[1][1].length - 1
          ].endPoint
        );
        expect(leftSegment[0].startPoint).toEqual(
          builder.verticalCurves[0][1][builder.verticalCurves[0][1].length - 1]
            .endPoint
        );
      }
    });

    it('should handle border pieces correctly', () => {
      // Manually checked result
      const bottomSegment = [
        new Curve({
          start: { x: 427, y: 427 },
          end: { x: 256, y: 427 },
          controlStart: { x: 390, y: 370 },
          controlEnd: { x: 302, y: 415 },
        }),
        new Curve({
          start: { x: 256, y: 427 },
          end: { x: 256, y: 342 },
          controlStart: { x: 210, y: 439 },
          controlEnd: { x: 259, y: 355 },
        }),
        new Curve({
          start: { x: 256, y: 342 },
          end: { x: 171, y: 342 },
          controlStart: { x: 253, y: 329 },
          controlEnd: { x: 181, y: 343 },
        }),
        new Curve({
          start: { x: 171, y: 342 },
          end: { x: 171, y: 427 },
          controlStart: { x: 161, y: 341 },
          controlEnd: { x: 212, y: 447 },
        }),
        new Curve({
          start: { x: 171, y: 427 },
          end: { x: 0, y: 427 },
          controlStart: { x: 130, y: 407 },
          controlEnd: { x: 53, y: 432 },
        }),
      ];

      const builder = new PiecesBuilder(completeGamePaths, pieceSize);
      builder.generateAllCurves();
      builder.applyRotationToVerticalCurves();

      // Test top-left corner piece
      const topLeftShape = builder.generateEnclosedShape(0, 0);

      expect(topLeftShape[0]).toBeNull(); // top segment should be null
      expect(topLeftShape[1]).toBe(builder.verticalCurves[0][0]); // right segment
      expect(topLeftShape[2]).toStrictEqual(bottomSegment); // bottom segment
      expect(topLeftShape[3]).toBeNull(); // left segment should be null
    });
  });

  describe('enclosedShapeToSvgPaths', () => {
    it('should convert enclosed shape to SVG paths', () => {
      const builder = new PiecesBuilder(completeGamePaths, pieceSize);
      builder.generateAllCurves();
      builder.applyRotationToVerticalCurves();

      const shape = builder.generateEnclosedShape(1, 1);
      const svgPaths = builder.enclosedShapeToSvgPaths(shape);

      // Check correct number of segments
      expect(svgPaths).toHaveLength(4);

      // Check that the first curve of each segment uses longhand notation
      svgPaths.forEach((segment) => {
        if (segment) {
          expect(segment[0]).toMatch(/^C /);
        }
      });

      // Check that subsequent curves use shorthand notation
      svgPaths.forEach((segment) => {
        if (segment && segment.length > 1) {
          expect(segment[1]).toMatch(/^S /);
        }
      });
    });

    it('should handle null segments', () => {
      const builder = new PiecesBuilder(completeGamePaths, pieceSize);
      builder.generateAllCurves();
      builder.applyRotationToVerticalCurves();

      const shape = builder.generateEnclosedShape(0, 0); // Corner piece with null segments
      const svgPaths = builder.enclosedShapeToSvgPaths(shape);

      expect(svgPaths).toHaveLength(4);
      expect(svgPaths[0]).toBeNull(); // Top segment should be null
      expect(svgPaths[3]).toBeNull(); // Left segment should be null
    });
  });

  describe('borderSvgPath', () => {
    it('should generate correct SVG path for border', () => {
      const endPoint = { x: 100, y: 200 };
      const svgPath = PiecesBuilder.borderSvgPath(endPoint);
      expect(svgPath).toBe('L 100 200');
    });
  });

  describe('enclosedShapeToSvg', () => {
    it('should generate complete SVG path for a piece', () => {
      const builder = new PiecesBuilder(completeGamePaths, pieceSize);
      builder.generateAllCurves();
      builder.applyRotationToVerticalCurves();

      const shape = builder.generateEnclosedShape(1, 1);
      const svgPaths = builder.enclosedShapeToSvgPaths(shape);
      const svg = builder.enclosedShapeToSvg(svgPaths, 1, 1);

      // Check that the SVG path starts with a move command
      expect(svg).toMatch(/^M \d+ \d+/);

      // Check that the SVG path ends with a close path command
      expect(svg).toMatch(/Z$/);

      // Check that the path contains curve commands (S with 4 numbers or C with 6 numbers)
      expect(svg).toMatch(/(?:S \d+ \d+ \d+ \d+|C \d+ \d+ \d+ \d+ \d+ \d+)/);
    });

    it('should handle border pieces correctly', () => {
      const builder = new PiecesBuilder(paths, pieceSize);
      builder.generateAllCurves();
      builder.applyRotationToVerticalCurves();

      // Test top-left corner piece
      const topLeftShape = builder.generateEnclosedShape(0, 0);
      const topLeftSvgPaths = builder.enclosedShapeToSvgPaths(topLeftShape);
      const topLeftSvg = builder.enclosedShapeToSvg(topLeftSvgPaths, 0, 0);

      // Check that the path includes straight lines for the borders
      expect(topLeftSvg).toMatch(/L \d+ \d+/);

      // Test bottom-right corner piece
      const bottomRightShape = builder.generateEnclosedShape(3, 4);
      const bottomRightSvgPaths =
        builder.enclosedShapeToSvgPaths(bottomRightShape);
      const bottomRightSvg = builder.enclosedShapeToSvg(
        bottomRightSvgPaths,
        3,
        4
      );

      // Check that the path includes straight lines for the borders
      expect(bottomRightSvg).toMatch(/L \d+ \d+/);
    });
  });
});
