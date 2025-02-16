import ButtonMainOption from "@/components/button-main-option";
import ThemeToggle from "@/components/theme-toggle";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: RouteComponent });

function RouteComponent() {
  return (
    <div>
      <header>
        <ThemeToggle />
      </header>
      <main className="flex flex-col items-center justify-center h-screen">
        <img width={150} src="/main-logo.png" alt="logo" />
        <ul className="flex flex-col gap-4">
          <li>
            <ButtonMainOption withPiece scheme="blue">
              Continue
            </ButtonMainOption>
          </li>
          <li>
            <ButtonMainOption withPiece scheme="purple">
              New Game
            </ButtonMainOption>
          </li>
          <li>
            <ButtonMainOption withPiece scheme="yellow">
              Join with ID
            </ButtonMainOption>
          </li>
        </ul>
      </main>
    </div>
  );
}
