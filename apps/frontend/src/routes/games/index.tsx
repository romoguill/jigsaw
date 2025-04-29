import PuzzleCard from "@/frontend/features/games/components/puzzle-card";
import { gamesQueryOptions } from "@/frontend/features/jigsaw/api/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/games/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(gamesQueryOptions());
  },
});

function RouteComponent() {
  const { data: games } = useSuspenseQuery(gamesQueryOptions());

  return (
    <div>
      <h1>Pick one puzzle</h1>
      <section>
        {games.map((game) => (
          <PuzzleCard
            key={game.id}
            id={game.id.toString()}
            difficulty={game.difficulty}
            imageUrl={game.imageUrl}
            pieceCount={game.pieceCount}
          />
        ))}
      </section>
    </div>
  );
}
