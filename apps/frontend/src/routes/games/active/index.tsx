import { gameSessionsQueryOptions } from "@/frontend/features/games/api/queries";
import PuzzleCard from "@/frontend/features/games/components/puzzle-card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/games/active/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(gameSessionsQueryOptions());
  },
});

function RouteComponent() {
  const { data: sessions } = useSuspenseQuery(gameSessionsQueryOptions());
  const navigate = Route.useNavigate();
  return (
    <div className="w-full p-10 container">
      <h1 className="text-2xl font-bold font-playful">Continue playing</h1>
      <section className="grid gap-4 mt-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session) => (
          <PuzzleCard
            key={session.id}
            id={session.id.toString()}
            difficulty={session.game.difficulty}
            imageUrl={session.game.imageUrl}
            pieceCount={session.game.pieceCount}
            onPlay={() => {
              navigate({ to: `/games/sessions/${session.sessionId}` });
            }}
          />
        ))}
      </section>
    </div>
  );
}
