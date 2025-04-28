import { gameQueryOptions } from "@/frontend/features/jigsaw/api/queries";
import Puzzle from "@/frontend/features/jigsaw/components/puzzle";
import { GameData, PiecesData } from "@/frontend/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createFileRoute("/games/$id")({
  component: RouteComponent,
  loader: async (opts) => {
    opts.context.queryClient.ensureQueryData(gameQueryOptions(opts.params.id));
  },
});

function RouteComponent() {
  const params = Route.useParams();
  const { data: gameData } = useSuspenseQuery(gameQueryOptions(params.id));

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
    piecesData: parsePieceData,
  };

  return <Puzzle puzzleData={puzzleData} />;
}
