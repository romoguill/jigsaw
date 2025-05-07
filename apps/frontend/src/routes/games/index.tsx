import { useCreateGameSession } from "@/frontend/features/games/api/mutations";
import PuzzleCard from "@/frontend/features/games/components/puzzle-card";
import { gamesQueryOptions } from "@/frontend/features/jigsaw/api/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/games/")({
  validateSearch: z
    .object({
      orderBy: z.enum(["difficulty", "pieceSize"]).optional(),
      orderDirection: z.enum(["asc", "desc"]).optional(),
    })
    .optional().parse,
  component: RouteComponent,
  loaderDeps: ({ search }) => ({
    orderBy: search?.orderBy,
    orderDirection: search?.orderDirection,
  }),
  loader: async ({ context, deps }) => {
    context.queryClient.ensureQueryData(
      gamesQueryOptions({
        orderBy: deps.orderBy,
        orderDirection: deps.orderDirection,
      })
    );
  },
});

function RouteComponent() {
  const queryParams = Route.useLoaderDeps();
  console.log(queryParams);
  const { data: games } = useSuspenseQuery(
    gamesQueryOptions({
      orderBy: queryParams.orderBy,
      orderDirection: queryParams.orderDirection,
    })
  );
  const { mutate: createGameSession } = useCreateGameSession();
  const navigate = useNavigate();

  return (
    <div className="w-full p-10 container">
      <h1 className="text-2xl font-bold font-playful">Pick one puzzle</h1>
      <section className="grid gap-4 mt-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <PuzzleCard
            key={game.id}
            id={game.id.toString()}
            difficulty={game.difficulty}
            imageUrl={game.imageUrl}
            pieceCount={game.pieceCount}
            onPlay={() =>
              createGameSession(
                { gameId: game.id },
                {
                  onSuccess: (data) => {
                    navigate({ to: `/games/sessions/${data.sessionId}` });
                  },
                }
              )
            }
          />
        ))}
      </section>
    </div>
  );
}
