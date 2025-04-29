import { gameSessionQueryOptions } from "@/frontend/features/games/api/queries";
import { useGameToPuzzleData } from "@/frontend/features/games/hooks/useGameToPuzzleData";
import { gameQueryOptions } from "@/frontend/features/jigsaw/api/queries";
import Puzzle from "@/frontend/features/jigsaw/components/puzzle";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/games/sessions/$sessionId")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const gameState = await context.queryClient.ensureQueryData(
      gameSessionQueryOptions(params.sessionId)
    );

    const gameData = await context.queryClient.ensureQueryData(
      gameQueryOptions(gameState.gameId.toString())
    );

    return { gameState, gameData };
  },
});

function RouteComponent() {
  const { sessionId } = Route.useParams();
  const { data: gameState } = useSuspenseQuery(
    gameSessionQueryOptions(sessionId)
  );
  const piecesData = useGameToPuzzleData(gameState.gameId);

  return <Puzzle puzzleData={piecesData} />;
}
