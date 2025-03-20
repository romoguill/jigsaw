import { RefObject } from "react";

interface UseImageToGameDataProps {
  image: RefObject<HTMLImageElement>;
  pieceQuantity: number;
}

function useImageToGameData({ image, pieceQuantity }: UseImageToGameDataProps) {
  if (!image.current) return null;

  // Get the original size of the image
  const { naturalWidth, naturalHeight } = image.current;

  // Pieces should be squares, so the aspect ratio of the image will determine the ammount of rows and columns based on the piece quantity
  const aspectRatio = naturalWidth / naturalHeight;

  // Equations to solve:
  // 1- Columns x Rows <= PieceQuantity
  // 2- (Rows / Columns) = AspectRatio
  //   const columns = Math.sqrt(pieceQuantity / aspectRatio);
  //   const rows = pieceQuantity / columns;
  // There is no guarantee to have integer values, must iterate to find biggest pieces possible
  let bestError;
  let finalColumns: number = pieceQuantity;
  let finalRows: number = 1;
  for (let columns = 1; columns <= pieceQuantity; columns++) {
    const rows = Math.floor(pieceQuantity / columns);

    if (rows * columns !== pieceQuantity) continue;

    const newAspectRatio = rows / columns;

    const error = Math.abs((newAspectRatio - aspectRatio) / aspectRatio);

    console.log(rows, columns);
    console.log(error);
    if (!bestError || error < bestError) {
      bestError = error;
      finalColumns = columns;
      finalRows = rows;
    } else {
      // Function is quadratic meaning that once the error starts increasing is pointless to keep iterating
      break;
    }
  }

  return {
    columns: finalColumns,
    rows: finalRows,
    pieceSize: naturalWidth / finalColumns,
  };
}

export default useImageToGameData;
