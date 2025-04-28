import { BuilderCard } from "@/frontend/features/jigsaw-builder/components/builder-card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_admin/create-game")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="grow flex items-center justify-center">
      <BuilderCard />
    </div>
  );
}
