import { useUpdateGameSession } from "@/frontend/features/games/api/mutations";
import { gameSessionQueryOptions } from "@/frontend/features/games/api/queries";
import useGameToPuzzleData from "@/frontend/features/games/hooks/useGameToPuzzleData";
import { gameQueryOptions } from "@/frontend/features/jigsaw/api/queries";
import GameToolbar from "@/frontend/features/jigsaw/components/nav/game-toolbar";
import Puzzle from "@/frontend/features/jigsaw/components/puzzle";
import WinningCard from "@/frontend/features/jigsaw/components/winning-card";
import { Jiggsaw } from "@/frontend/features/jigsaw/jigsaw";
import useGameStore from "@/frontend/store/game-store";
import { GameState } from "@jigsaw/shared";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { toast } from "sonner";

export const Route = createFileRoute("/games/sessions/$sessionId")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const gameDetails = await context.queryClient.ensureQueryData(
      gameSessionQueryOptions(params.sessionId)
    );

    const gameData = await context.queryClient.ensureQueryData(
      gameQueryOptions(gameDetails.gameId.toString())
    );

    return { gameDetails, gameData };
  },
});

function RouteComponent() {
  const puzzleRef = useRef<Jiggsaw | null>(null);
  const { sessionId } = Route.useParams();

  const [gameSavedState, setGameSavedState] = useState<GameState | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isGameFinished, setIsGameFinshed] = useState(false);

  const { data: gameDetails } = useSuspenseQuery(
    gameSessionQueryOptions(sessionId)
  );
  const piecesData = useGameToPuzzleData(gameDetails.gameId, sessionId);
  const { mutate: updateGameSession, isPending: isUpdating } =
    useUpdateGameSession();

  const fullScreenHandle = useFullScreenHandle();
  const timer = useGameStore((state) => state.timer);

  // Used for the save button to show a loading state
  useEffect(() => {
    if (gameSavedState) {
      setIsSaved(true);
    }

    const timeout = setTimeout(() => {
      setIsSaved(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [gameSavedState]);

  const handleUpdateState = () => {
    if (puzzleRef.current) {
      const gameState = puzzleRef.current.getGameState();
      updateGameSession(
        { sessionId, gameState, timer, isFinished: false },
        {
          onSuccess: () => {
            setGameSavedState(gameState);
          },
          onError: () => {
            toast.error("Failed to update game state");
          },
        }
      );
    }
  };

  const checkGameFinished = () => {
    if (puzzleRef.current) {
      if (puzzleRef.current.checkGameFinished()) {
        const gameState = puzzleRef.current.getGameState();
        setIsGameFinshed(true);
        updateGameSession({ sessionId, gameState, timer, isFinished: true });
      }
    }
  };

  return (
    <FullScreen handle={fullScreenHandle}>
      <GameToolbar
        fullScreenHandle={fullScreenHandle}
        isSaving={isUpdating}
        isSaved={isSaved}
        isGameFinished={isGameFinished}
        onSave={handleUpdateState}
      />

      <Puzzle
        ref={puzzleRef}
        puzzleData={piecesData}
        onPieceMove={checkGameFinished}
      />

      <WinningCard isVisible={isGameFinished} />
    </FullScreen>
  );
}
