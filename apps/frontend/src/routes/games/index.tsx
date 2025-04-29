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
    <div className="w-full p-10 container">
      <h1 className="text-2xl font-bold">Pick one puzzle</h1>
      <section className="grid gap-4 mt-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
