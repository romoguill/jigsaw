import { Button } from "@/frontend/components/ui/button";
import { useCreateGameSession } from "@/frontend/features/games/api/mutations";
import PuzzleCard from "@/frontend/features/games/components/puzzle-card";
import { gamesQueryOptions } from "@/frontend/features/jigsaw/api/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpDown } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/games/")({
  validateSearch: z
    .object({
      orderBy: z.enum(["difficulty", "pieceCount"]).optional(),
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
  const navigate = Route.useNavigate();
  const { data: games } = useSuspenseQuery(
    gamesQueryOptions({
      orderBy: queryParams.orderBy,
      orderDirection: queryParams.orderDirection,
    })
  );
  const { mutate: createGameSession } = useCreateGameSession();

  return (
    <div className="w-full p-10 container">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-playful h-8">Pick one puzzle</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => {
              // Alternate between ascending and descending order if the same orderBy is selected
              navigate({
                search: (prev) => {
                  if (prev?.orderBy === "difficulty") {
                    return {
                      ...prev,
                      orderDirection:
                        prev.orderDirection === "asc" ? "desc" : "asc",
                    };
                  }
                  return {
                    ...prev,
                    orderBy: "difficulty",
                    orderDirection: "asc",
                  };
                },
              });
            }}
          >
            <ArrowUpDown size={16} />
            <span>Difficulty</span>
          </Button>
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => {
              navigate({
                search: (prev) => {
                  if (prev?.orderBy === "pieceCount") {
                    return {
                      ...prev,
                      orderDirection:
                        prev.orderDirection === "asc" ? "desc" : "asc",
                    };
                  }
                  return {
                    ...prev,
                    orderBy: "pieceCount",
                    orderDirection: "asc",
                  };
                },
              });
            }}
          >
            <ArrowUpDown size={16} />
            <span>Pieces</span>
          </Button>
        </div>
      </div>
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
