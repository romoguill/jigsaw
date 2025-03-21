import { RefObject } from "react";

interface UseImageToGameDataProps {
  image: RefObject<HTMLImageElement>;
  pieceQuantity: number;
}

function useImageToGameData({ image, pieceQuantity }: UseImageToGameDataProps) {
  if (!image.current) return null;

  // Get the original size of the image
  const { naturalWidth, naturalHeight } = image.current;

  // Equations to solve:
  // 1- Columns x Rows <= PieceQuantity
  // 2- (Rows / Columns) = AspectRatio
  //   const columns = Math.sqrt(pieceQuantity / aspectRatio);
  //   const rows = pieceQuantity / columns;
  // There is no guarantee to have integer values, must iterate to find biggest pieces possible, or in other words maximize the area of the valid grid vs the image original size
  let maxArea;
  let finalColumns: number = pieceQuantity;
  let finalRows: number = 1;
  let finalPieceSize: number = 0;
  for (let columns = 1; columns <= pieceQuantity; columns++) {
    const rows = Math.floor(pieceQuantity / columns);

    // Avoid iterating if piece quantity is not satisfied
    if (pieceQuantity !== rows * columns) continue;

    // Since pieces are squares i need the minimun value from sizes relations
    const pieceSize = Math.min(naturalWidth / columns, naturalHeight / rows);
    // Get the area covered by the iteration
    const gridArea = pieceSize ** 2 * pieceQuantity;

    if (!maxArea || gridArea > maxArea) {
      maxArea = gridArea;
      finalColumns = columns;
      finalRows = rows;
      finalPieceSize = pieceSize;
    } else {
      // Function is quadratic meaning that once the error starts increasing is pointless to keep iterating
      break;
    }
  }

  return {
    columns: finalColumns - 1,
    rows: finalRows - 1,
    pieceSize: finalPieceSize,
    adjustedWidth: finalColumns * finalPieceSize,
    adjustedHeight: finalRows * finalPieceSize,
  };
}

export default useImageToGameData;
