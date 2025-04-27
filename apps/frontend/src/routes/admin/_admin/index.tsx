import { BuilderCard } from "@/features/jigsaw-builder/components/builder-card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="grow flex items-center justify-center">
      <BuilderCard />
    </main>
  );
}
