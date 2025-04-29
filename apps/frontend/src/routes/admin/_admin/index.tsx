import { buttonVariants } from "@/frontend/components/ui/jolly-utils";
import GamesTable from "@/frontend/features/admin/components/games-table";
import { gamesQueryOptions } from "@/frontend/features/jigsaw/api/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

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
    <div className="grow flex flex-col gap-8 items-center justify-center">
      <Link
        to="/admin/create-game"
        className={buttonVariants({ variant: "default" })}
      >
        Create Game
      </Link>
      <GamesTable games={games} />
    </div>
  );
}
