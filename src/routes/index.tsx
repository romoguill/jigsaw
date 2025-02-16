import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <img width={150} src="/main-logo.png" alt="logo" />
      <Button>New Game</Button>
      <Button></Button>
    </main>
  );
}
