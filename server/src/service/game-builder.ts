import type { Coordinate } from '@jigsaw/shared/index.js';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { Path } from 'src/core/path.js';
import { PiecesBuilder } from 'src/core/pieces-builder.js';
import { calculatePinSize } from 'src/lib/utils.js';

export const pathGenerator = ({
  origin,
  pieceSize,
  cols,
  rows,
}: {
  origin: Coordinate;
  pieceSize: number;
  cols: number;
  rows: number;
}) => {
  const paths: { horizontal: string[]; vertical: string[] } = {
    horizontal: [],
    vertical: [],
  };

  const pinSize = calculatePinSize(pieceSize);

  // Generate horizontal paths
  for (let i = 0; i < rows; i++) {
    const pathBuilder = new Path(origin, pieceSize, pinSize, cols + 1);

    pathBuilder.generateCompletePath('complete');

    paths.horizontal.push(pathBuilder.toString());
  }

  // Generate vertical paths
  for (let i = 0; i < cols; i++) {
    const pathBuilder = new Path(origin, pieceSize, pinSize, rows + 1);

    pathBuilder.generateCompletePath('complete');

    paths.vertical.push(pathBuilder.toString());
  }

  return paths;
};

// Create the svg for the pieces and some metadata of the game.
export const createPieces = ({
  horizontalPaths,
  verticalPaths,
}: {
  horizontalPaths: string[];
  verticalPaths: string[];
}) => {
  const piecesBuilder = new PiecesBuilder({
    horizontalPaths,
    verticalPaths,
  });

  // Extract the number of rows and columns from the paths
  const rows = piecesBuilder.horizontalCurves.length;
  const cols = piecesBuilder.verticalCurves.length;
  const pieceSize = piecesBuilder.pieceSize;

  // Generate all curves. Creates curve objects for each path.
  piecesBuilder.generateAllCurves();

  // Apply rotation to vertical curves. Originaly the vertical paths are generated as horizontal.
  piecesBuilder.applyRotationToVerticalCurves();

  // Generate the enclosing shape as svg for each piece
  const enclosedShapesSvg: string[][] = [];
  for (let i = 0; i <= rows; i++) {
    const column: string[] = [];
    for (let j = 0; j <= cols; j++) {
      const enclosedShape = piecesBuilder.generateEnclosedShape(i, j);
      const svgPaths = piecesBuilder.enclosedShapeToSvgPaths(enclosedShape);
      const enclosedShapeSvg = piecesBuilder.enclosedShapeToSvg(svgPaths, i, j);

      column.push(enclosedShapeSvg);
    }
    enclosedShapesSvg.push(column);
  }

  return { enclosedShapesSvg, rows, cols, pieceSize };
};

type ImagePiece = {
  x: number;
  y: number;
  width: number;
  height: number;
  path: string;
};

export const cutImageIntoPieces = async ({
  imageBuffer,
  rows,
  cols,
  pieceSize,
  enclosedShapesSvg,
}: {
  imageBuffer: Buffer;
  pieceSize: number;
  rows: number;
  cols: number;
  enclosedShapesSvg: string[][];
}) => {
  const pieces: ImagePiece[] = [];
  console.log({ pieceSize });

  // Create pieces_cut directory if it doesn't exist
  const piecesDir = path.join(process.cwd(), 'pieces_cut');
  if (!fs.existsSync(piecesDir)) {
    fs.mkdirSync(piecesDir, { recursive: true });
  }

  // Create a sharp instance for the main image
  const image = sharp(imageBuffer);
  const metadata = await image.metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error('Invalid image dimensions');
  }

  // Create pieces based on paths
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Create SVG mask for this piece
      const svgMask = `
            <svg width="${pieceSize + 180}" height="${pieceSize + 180}" viewBox="${pieceSize * col - 90} ${pieceSize * row - 90} ${pieceSize + 20} ${pieceSize + 20}">
              <path d="${enclosedShapesSvg[row][col]}" fill="white"/>
            </svg>`;

      console.log(svgMask);

      // Create the piece using composite
      const pieceBuffer = await sharp(imageBuffer)
        .extract({
          // left: Math.max(0, col * pieceSize - 10),
          // top: Math.max(0, row * pieceSize - 10),
          // width: Math.min(pieceSize + 20, metadata.width),
          // height: Math.min(pieceSize + 20, metadata.height),
          left: 0,
          top: 0,
          width: metadata.width,
          height: metadata.height,
        })
        .composite([
          {
            input: Buffer.from(svgMask),
            blend: 'dest-in',
            gravity: 'northwest',
          },
        ])
        .png()
        .toBuffer();

      const piecePath = path.join(piecesDir, `piece_${row}_${col}.png`);
      await sharp(pieceBuffer).toFile(piecePath);

      pieces.push({
        x: col * pieceSize,
        y: row * pieceSize,
        width: pieceSize,
        height: pieceSize,
        path: piecePath,
      });
    }
  }

  return pieces;
};
