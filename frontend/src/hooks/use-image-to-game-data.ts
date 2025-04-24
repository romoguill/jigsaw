import { RefObject, useEffect, useState } from "react";

interface UseImageToGameDataProps {
  image: RefObject<HTMLImageElement>;
  pieceQuantity: number | undefined;
}

function useImageToGameData({ image, pieceQuantity }: UseImageToGameDataProps) {
  const [columns, setColumns] = useState(1);
  const [rows, setRows] = useState(1);
  const [pieceSize, setPieceSize] = useState(0);

  useEffect(() => {
    const calculateGameData = () => {
      if (!image.current) return null;
      if (pieceQuantity === undefined) return null;
      // Get the original size of the image
      const { naturalWidth, naturalHeight } = image.current;

      // Equations to solve:
      // 1- Columns x Rows <= PieceQuantity
      // 2- (Rows / Columns) = AspectRatio
      //   const columns = Math.sqrt(pieceQuantity / aspectRatio);
      //   const rows = pieceQuantity / columns;
      // There is no guarantee to have integer values, must iterate to find biggest pieces possible, or in other words maximize the area of the valid grid vs the image original size
      let maxArea;
      let finalColumns = 1;
      let finalRows = 1;
      let finalPieceSize = 1;
      for (let columns = 1; columns <= pieceQuantity; columns++) {
        const rows = Math.floor(pieceQuantity / columns);

        // Avoid iterating if piece quantity is not satisfied
        if (pieceQuantity !== rows * columns) continue;

        // Since pieces are squares i need the minimun value from sizes relations
        const pieceSize = Math.min(
          Math.floor(naturalWidth / columns),
          Math.floor(naturalHeight / rows)
        );
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

      console.log("finalColumns", finalColumns);
      console.log("finalRows", finalRows);
      console.log("finalPieceSize", finalPieceSize);

      return {
        finalColumns,
        finalRows,
        finalPieceSize,
      };
    };

    const gameData = calculateGameData();

    if (!gameData) return;

    setColumns(gameData.finalColumns);
    setRows(gameData.finalRows);
    setPieceSize(gameData.finalPieceSize);
  }, [image, pieceQuantity]);

  return {
    columns,
    rows,
    pieceSize: pieceSize,
    adjustedWidth: columns * pieceSize,
    adjustedHeight: rows * pieceSize,
  };
}

export default useImageToGameData;
