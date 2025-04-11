import { PiecesBuilder } from '../pieces-builder.js';

const horizontalPaths = [
  'M 0 0 C 76 -33 181 13 256 0 S 255 109 256 128 S 371 145 384 128 S 322 15 384 0 S 556 69 640 0',
  'M 0 0 C 79 -51 198 31 256 0 S 270 -119 256 -128 S 369 -133 384 -128 S 329 -10 384 0 S 560 19 640 0',
];

const verticalPaths = [
  'M 0 0 C 73 57 204 5 256 0 S 258 111 256 128 S 363 136 384 128 S 332 -4 384 0 S 568 58 640 0 S 824 -18 896 0 S 877 120 896 128 S 1028 144 1024 128 S 958 38 1024 0 S 1197 -29 1280 0',
  'M 0 0 C 46 75 188 27 256 0 S 256 105 256 128 S 391 146 384 128 S 337 -21 384 0 S 552 -59 640 0 S 843 -1 896 0 S 888 -109 896 -128 S 1031 -148 1024 -128 S 972 15 1024 0 S 1218 -65 1280 0',
];

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

      const result = builder.parsePath(paths.horizontalPaths[0]);

      // The path has one segment, so we expect one array in the result
      expect(result.length).toBe(1);

      // The segment should contain the coordinates
      expect(result[0]).toEqual([
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
      ]);
    });

    it('should parse a path with multiple segments', () => {
      const builder = new PiecesBuilder(paths);

      const result = builder.parsePath(paths.verticalPaths[0]);

      expect(result.length).toBe(2);

      expect(result[0]).toEqual([
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
      ]);

      expect(result[1]).toEqual([
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
      ]);
    });

    it('should handle invalid paths without move command', () => {
      const builder = new PiecesBuilder({
        horizontalPaths: [],
        verticalPaths: [],
      });
      const path = paths.horizontalPaths[0];
      const pathWithoutM = path.slice(1);

      expect(() => builder.parsePath(pathWithoutM)).toThrow();
    });

    it('should handle paths with incorrect length', () => {
      const builder = new PiecesBuilder({
        horizontalPaths: [],
        verticalPaths: [],
      });
      const path = paths.horizontalPaths[0];
      const pathWithIncorrectLength = path.slice(0, 10);

      expect(() => builder.parsePath(pathWithIncorrectLength)).toThrow();
    });
  });
});
