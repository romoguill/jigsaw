import { ButtonLoader } from "@/frontend/components/ui/button-loader";
import { useUpdateGameSession } from "@/frontend/features/games/api/mutations";
import { gameSessionQueryOptions } from "@/frontend/features/games/api/queries";
import { useGameToPuzzleData } from "@/frontend/features/games/hooks/useGameToPuzzleData";
import { gameQueryOptions } from "@/frontend/features/jigsaw/api/queries";
import Puzzle from "@/frontend/features/jigsaw/components/puzzle";
import { Jiggsaw } from "@/frontend/features/jigsaw/jigsaw";
import { GameState } from "@jigsaw/shared";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { SaveIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
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
  const [gameSavedState, setGameSavedState] = useState<GameState | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const { sessionId } = Route.useParams();

  const { data: gameDetails } = useSuspenseQuery(
    gameSessionQueryOptions(sessionId)
  );
  const piecesData = useGameToPuzzleData(gameDetails.gameId, sessionId);
  const { mutate: updateGameSession, isPending: isUpdating } =
    useUpdateGameSession();

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
        { sessionId, gameState },
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
        toast.success("Game finished!");
      }
    }
  };

  return (
    <>
      <ButtonLoader
        className="absolute top-5 left-5"
        variant={"ghost"}
        onClick={handleUpdateState}
        isPending={isUpdating}
      >
        <SaveIcon size={20} />
        <AnimatePresence>
          {isSaved && (
            <motion.span
              key="game-saved"
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="text-green-300 absolute left-12 top-1/2 -translate-y-1/2"
            >
              Game saved!
            </motion.span>
          )}
        </AnimatePresence>
      </ButtonLoader>
      <Puzzle
        ref={puzzleRef}
        puzzleData={piecesData}
        onPieceMove={checkGameFinished}
      />
    </>
  );
}
