import ButtonMainOption from "@/components/button-main-option";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <img width={150} src="/main-logo.png" alt="logo" />
      <ul className="flex flex-col gap-4">
        <li>
          <ButtonMainOption withPiece>Continue</ButtonMainOption>
        </li>
        <li>
          <ButtonMainOption withPiece>New Game</ButtonMainOption>
        </li>
        <li>
          <ButtonMainOption withPiece>Join with ID</ButtonMainOption>
        </li>
      </ul>
    </main>
  );
}
