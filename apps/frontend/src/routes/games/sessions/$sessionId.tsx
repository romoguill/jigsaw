import { gameSessionQueryOptions } from "@/frontend/features/games/api/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/games/sessions/$sessionId")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    context.queryClient.ensureQueryData(
      gameSessionQueryOptions(params.sessionId)
    );
  },
});

function RouteComponent() {
  const { sessionId } = Route.useParams();
  const { data } = useSuspenseQuery(gameSessionQueryOptions(sessionId));

  return <div>Hello "/games/session/$sessionId"!</div>;
}
