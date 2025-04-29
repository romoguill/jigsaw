import { GameData, PiecesData } from "@/frontend/types";

import { gameQueryOptions } from "@/frontend/features/jigsaw/api/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useGameToPuzzleData = (gameId: number) => {
  const { data: gameData } = useSuspenseQuery(
    gameQueryOptions(gameId.toString())
  );

  const parsePieceData = useMemo(() => {
    const piecesData: PiecesData = [];

    gameData.pieces.forEach((piece) => {
      const rowIndex = piece.row;
      const colIndex = piece.col;

      if (!piecesData[rowIndex]) {
        piecesData[rowIndex] = [];
      }

      piecesData[rowIndex][colIndex] = {
        id: piece.id.toString(),
        image: piece.uploadedImage.url,
      };
    });

    return piecesData;
  }, [gameData]);

  const puzzleData: GameData = {
    pieceSize: gameData.pieceSize,
    pieceFootprint: gameData.pieceFootprint,
    piecesData: parsePieceData,
  };

  return puzzleData;
};
