import type { Coordinate } from '@jigsaw/shared';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { Path } from '../core/path.js';
import { PiecesBuilder } from '../core/pieces-builder.js';
import { calculatePinSize } from '../lib/utils.js';

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
  for (let i = 0; i < rows - 1; i++) {
    const pathBuilder = new Path(origin, pieceSize, pinSize, cols);

    pathBuilder.generateCompletePath('complete');

    paths.horizontal.push(pathBuilder.toString());

    // Set it here to avoid recalculating it for each path
    pieceFootprint =
      pieceFootprint === 0 ? pathBuilder.pieceFootprint : pieceFootprint;
  }

  // Generate vertical paths
  for (let i = 0; i < cols - 1; i++) {
    const pathBuilder = new Path(origin, pieceSize, pinSize, rows);

    pathBuilder.generateCompletePath('complete');

    paths.vertical.push(pathBuilder.toString());
  }

  return { paths, pieceFootprint };
};

// Create the svg for the pieces and some metadata of the game.
export const createPieces = ({
  horizontalPaths,
  verticalPaths,
  pieceSize,
}: {
  horizontalPaths: string[];
  verticalPaths: string[];
  pieceSize: number;
}) => {
  const piecesBuilder = new PiecesBuilder(
    {
      horizontalPaths,
      verticalPaths,
    },
    pieceSize
  );

  // Extract the number of rows and columns from the paths
  const rows = piecesBuilder.horizontalCurves.length + 1;
  const cols = piecesBuilder.verticalCurves.length + 1;

  // Generate all curves. Creates curve objects for each path.
  piecesBuilder.generateAllCurves();

  // Apply rotation to vertical curves. Originaly the vertical paths are generated as horizontal.
  piecesBuilder.applyRotationToVerticalCurves();

  // Generate the enclosing shape as svg for each piece
  const enclosedShapesSvg: string[][] = [];
  for (let i = 0; i < rows; i++) {
    const column: string[] = [];
    for (let j = 0; j < cols; j++) {
      const enclosedShape = piecesBuilder.generateEnclosedShape(i, j);
      const svgPaths = piecesBuilder.enclosedShapeToSvgPaths(enclosedShape);
      const enclosedShapeSvg = piecesBuilder.enclosedShapeToSvg(svgPaths, i, j);

      column.push(enclosedShapeSvg);
    }
    enclosedShapesSvg.push(column);
  }

  return { enclosedShapesSvg, rows, cols, pieceSize };
};

// Since the piece count will determine a smaller or equal size of the puzzle vs the image, I need to cut the image to the puzzle size.
const cutImageToPuzzleSize = async ({
  imageBuffer,
  pieceSize,
  rows,
  cols,
}: {
  imageBuffer: Buffer;
  pieceSize: number;
  rows: number;
  cols: number;
}) => {
  const image = sharp(imageBuffer);
  const metadata = await image.metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error('Invalid image dimensions');
  }

  const puzzleWidth = pieceSize * cols;
  const puzzleHeight = pieceSize * rows;

  const buffer = await image
    .extract({
      left: Math.floor((metadata.width - puzzleWidth) / 2),
      top: Math.floor((metadata.height - puzzleHeight) / 2),
      width: puzzleWidth,
      height: puzzleHeight,
    })
    .toBuffer();

  const newMetadata = await sharp(buffer).metadata();
  if (!newMetadata.width || !newMetadata.height) {
    throw new Error('Invalid image dimensions');
  }

  return { buffer, metadata: newMetadata };
};

//
const addPaddingToImage = async ({
  imageBuffer,
  pieceFootprint,
  pieceSize,
}: {
  imageBuffer: Buffer;
  pieceFootprint: number;
  pieceSize: number;
}) => {
  let buffer = imageBuffer;
  // Since the piece footprint is greater than the image, I need to extend the image with padding, to avoid cutting the pieces out of the image.
  const padding = pieceFootprint - pieceSize;

  if (padding > 0) {
    buffer = await sharp(imageBuffer)
      .extend({
        top: Math.ceil(padding / 2),
        bottom: Math.ceil(padding / 2),
        left: Math.ceil(padding / 2),
        right: Math.ceil(padding / 2),
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .toBuffer();
  }

  const metadata = await sharp(buffer).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error('Invalid image dimensions');
  }

  return { buffer, metadata };
};

type ImagePiece = {
  row: number;
  col: number;
  width: number;
  height: number;
  file: File;
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

  // Cut the image to the puzzle size
  const puzzleImageCut = await cutImageToPuzzleSize({
    imageBuffer,
    pieceSize,
    rows,
    cols,
  });

  const paddedImage = await addPaddingToImage({
    imageBuffer: puzzleImageCut.buffer,
    pieceFootprint,
    pieceSize,
  });

  // Create pieces based on paths
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
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

      const svgBorderMask = `
            <svg width="${pieceFootprint}" height="${pieceFootprint}" viewBox="${translateOffsetX} ${translateOffsetY} ${pieceFootprint} ${pieceFootprint}">
              <path d="${enclosedShapesSvg[row][col]}" stroke="rgba(25, 25, 25, 0.5)" stroke-width="5" fill="none"/>
            </svg>`;

      // Create the piece by first cutting the image and then compositing the svg mask
      const pieceBuffer = await sharp(paddedImage.buffer)
        .extract({
          left: pieceSize * col,
          top: pieceSize * row,
          width: pieceFootprint,
          height: pieceFootprint,
        })
        .composite([
          {
            input: Buffer.from(svgMask),
            blend: 'dest-in',
            gravity: 'northwest',
          },
          {
            input: Buffer.from(svgBorderMask),
            blend: 'over',
            gravity: 'northwest',
          },
        ])
        .png()
        .toBuffer();

      // Convert Buffer to File
      const blob = new Blob([pieceBuffer], { type: 'image/png' });
      const file = new File([blob], `piece_${row}_${col}.png`, {
        type: 'image/png',
      });

      pieces.push({
        row,
        col,
        width: pieceSize,
        height: pieceSize,
        file,
      });
    }
  }

  return pieces;
};
