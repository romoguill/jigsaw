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
  let pieceFootprint = 0;
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

    // Set it here to avoid recalculating it for each path
    pieceFootprint =
      pieceFootprint === 0 ? pathBuilder.pieceFootprint : pieceFootprint;
  }

  // Generate vertical paths
  for (let i = 0; i < cols; i++) {
    const pathBuilder = new Path(origin, pieceSize, pinSize, rows + 1);

    pathBuilder.generateCompletePath('complete');

    paths.vertical.push(pathBuilder.toString());
  }

  return { paths, pieceFootprint };
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
  pieceFootprint,
  enclosedShapesSvg,
}: {
  imageBuffer: Buffer;
  pieceSize: number;
  pieceFootprint: number;
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

  console.log('Image dimensions:', {
    width: metadata.width,
    height: metadata.height,
    pieceFootprint,
    rows,
    cols,
    totalWidth: pieceFootprint * cols,
    totalHeight: pieceFootprint * rows,
  });

  // Since the piece footprint is greater than the image, I need to extend the image with padding, to avoid cutting the pieces out of the image.
  const padding = pieceFootprint - pieceSize;

  let paddedImageBuffer = imageBuffer;
  if (padding > 0) {
    paddedImageBuffer = await sharp(imageBuffer)
      .extend({
        top: Math.ceil(padding / 2),
        bottom: Math.ceil(padding / 2),
        left: Math.ceil(padding / 2),
        right: Math.ceil(padding / 2),
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .toBuffer();
  }

  const paddedMetadata = await sharp(paddedImageBuffer).metadata();
  if (!paddedMetadata.width || !paddedMetadata.height) {
    throw new Error('Invalid image dimensions');
  }

  console.log('Image padded:', {
    width: paddedMetadata.width,
    height: paddedMetadata.height,
    pieceFootprint,
    rows,
    cols,
    totalWidth: pieceFootprint * cols,
    totalHeight: pieceFootprint * rows,
  });

  // Create pieces based on paths
  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= cols; col++) {
      // This offset will center the piece of size pieceSize inside the pieceFootprint
      const translateOffsetX =
        pieceSize * col - (pieceFootprint - pieceSize) / 2;
      const translateOffsetY =
        pieceSize * row - (pieceFootprint - pieceSize) / 2;
      // Create SVG mask for this piece
      const svgMask = `
            <svg width="${pieceFootprint}" height="${pieceFootprint}" viewBox="${translateOffsetX} ${translateOffsetY} ${pieceFootprint} ${pieceFootprint}">
              <path d="${enclosedShapesSvg[row][col]}" fill="white"/>
            </svg>`;

      console.log(svgMask);

      const extractParams = {
        left: pieceFootprint * col,
        top: pieceFootprint * row,
        width: pieceFootprint,
        height: pieceFootprint,
      };

      console.log('Extraction parameters for piece:', {
        row,
        col,
        ...extractParams,
        exceedsWidth:
          extractParams.left + extractParams.width > paddedMetadata.width,
        exceedsHeight:
          extractParams.top + extractParams.height > paddedMetadata.height,
      });

      // Create the piece using composite
      const pieceBuffer = await sharp(paddedImageBuffer)
        .extract(extractParams)
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
