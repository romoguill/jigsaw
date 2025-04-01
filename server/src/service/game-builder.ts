import type { Coordinate } from '@jigsaw/shared/index.js';
import { Path } from 'src/core/path.js';
import { calculatePinSize } from 'src/lib/utils.js';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

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

type ImagePiece = {
  x: number;
  y: number;
  width: number;
  height: number;
  path: string;
};

export const cutImageIntoPieces = async ({
  imageBuffer,
  pieceSize,
  horizontalPaths,
  verticalPaths,
}: {
  imageBuffer: Buffer;
  pieceSize: number;
  horizontalPaths: string[];
  verticalPaths: string[];
}) => {
  const pieces: ImagePiece[] = [];
  const rows = horizontalPaths.length;
  const cols = verticalPaths.length;

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

  // // Calculate the total width and height of the puzzle
  // const totalWidth = cols * pieceSize;
  // const totalHeight = rows * pieceSize;

  // // Resize the image to match the puzzle dimensions
  // const resizedImage = await image
  //   .resize(totalWidth, totalHeight, {
  //     fit: 'cover',
  //     position: 'center',
  //   })
  //   .toBuffer();

  // Create pieces based on paths
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Create SVG mask for this piece
      const svgMask = `
        <svg width="${pieceSize}" height="${pieceSize}">
          <path d="${horizontalPaths[row]}" transform="translate(0 ${(row + 1) * pieceSize})" fill="black"/>
          <path d="${horizontalPaths[row + 1]}" transform="translate(0 ${(row + 1) * pieceSize})" fill="black"/>
          <path d="${verticalPaths[col]}" transform="translate(0 ${-col * pieceSize}) rotate(90)" fill="black"/>
          <path d="${verticalPaths[col + 1]}" transform="translate(0 ${-col * pieceSize}) rotate(90)" fill="black"/>
        </svg>`;

      console.log({
        left: col * pieceSize,
        top: row * pieceSize,
        width: pieceSize,
        height: pieceSize,
      });
      // Create the piece using composite
      const pieceBuffer = await sharp(imageBuffer)
        .extract({
          left: col * pieceSize,
          top: row * pieceSize,
          width: pieceSize,
          height: pieceSize,
        })
        .composite([
          {
            input: Buffer.from(svgMask),
            blend: 'dest-out',
            gravity: 'northwest',
          },
        ])
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
