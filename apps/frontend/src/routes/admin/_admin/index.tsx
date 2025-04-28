import { gamesQueryOptions } from "@/frontend/features/jigsaw/api/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_admin/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(gamesQueryOptions());
  },
});

function RouteComponent() {
  const { data: games } = useSuspenseQuery(gamesQueryOptions());
  console.log(games);

  return (
    <main className="grow flex items-center justify-center">
      {JSON.stringify(games)}
    </main>
  );
}
