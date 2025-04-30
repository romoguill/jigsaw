import { GameData, PiecesData } from "@/frontend/types";

import { gameQueryOptions } from "@/frontend/features/jigsaw/api/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { gameSessionQueryOptions } from "../api/queries";

export const useGameToPuzzleData = (
  gameId: number,
  sessionId: string
): GameData => {
  const { data: gameData } = useSuspenseQuery(
    gameQueryOptions(gameId.toString())
  );

  const { data: gameDetails } = useSuspenseQuery(
    gameSessionQueryOptions(sessionId.toString())
  );

  const parsedPieceData: GameData["piecesData"] = useMemo(() => {
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

  const parsedGroupsData: GameData["groupsData"] = useMemo(() => {
    return gameDetails.gameState.groups.map((group) => ({
      id: group.id.toString(),
      origin: group.origin,
    }));
  }, [gameDetails]);

  const puzzleData: GameData = {
    pieceSize: gameData.pieceSize,
    groupsData: parsedGroupsData,
    pieceFootprint: gameData.pieceFootprint,
    piecesData: parsedPieceData,
  };

  return puzzleData;
};
