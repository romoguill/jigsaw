import Puzzle from "@/features/jigsaw/components/puzzle";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/games/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Puzzle />;
}
