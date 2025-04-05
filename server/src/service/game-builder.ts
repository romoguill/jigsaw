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
  const decomposedPath = Path.segmentsDecomposer(horizontalPaths[0]);

  const curvesDetails = Path.getCurvesDetails(decomposedPath, 0);

  for (let i = 0; i < rows - 1; i++) {
    for (let j = 0; j < cols - 1; j++) {
      const enclosingPath = Path.createEnclosingPath(
        { horizontalPaths, verticalPaths },
        i,
        j,
        pieceSize
      );

      const enclosingPathSvg = Path.getPathSvg(enclosingPath);
      console.log('enclosing path svg');
      console.log(enclosingPathSvg);

      // Create pieces based on paths
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Create SVG mask for this piece
          const svgMask = `
            <svg width="${pieceSize}" height="${pieceSize}" viewBox="400 400 ${400 + pieceSize} ${400 + pieceSize}">
              <path d="${enclosingPathSvg}" fill="white"/>
            </svg>`;

          console.log('svg mask');
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
    }
  }

  return pieces;
};
