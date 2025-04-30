import { Button } from "@/frontend/components/ui/button";
import { useUpdateGameSession } from "@/frontend/features/games/api/mutations";
import { gameSessionQueryOptions } from "@/frontend/features/games/api/queries";
import { useGameToPuzzleData } from "@/frontend/features/games/hooks/useGameToPuzzleData";
import { gameQueryOptions } from "@/frontend/features/jigsaw/api/queries";
import Puzzle from "@/frontend/features/jigsaw/components/puzzle";
import { Jiggsaw } from "@/frontend/features/jigsaw/jigsaw";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
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

  const { data: gameDetails } = useSuspenseQuery(
    gameSessionQueryOptions(sessionId)
  );
  const piecesData = useGameToPuzzleData(gameDetails.gameId);
  const { mutate: updateGameSession } = useUpdateGameSession();

  const handleUpdateState = () => {
    if (puzzleRef.current) {
      const gameState = puzzleRef.current.getGameState();
      updateGameSession(
        { sessionId, gameState },
        {
          onSuccess: () => {
            toast.success("Game state updated");
          },
          onError: () => {
            toast.error("Failed to update game state");
          },
        }
      );
    }
  };

  return (
    <>
      <Button className="absolute top-5 left-5" onClick={handleUpdateState}>
        Save
      </Button>
      <Puzzle puzzleData={piecesData} ref={puzzleRef} />;
    </>
  );
}
