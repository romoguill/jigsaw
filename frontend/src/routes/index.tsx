import AccountMenu from "@/components/account-menu";
import GoogleOAuthButton from "@/components/auth/google-oauth-button";
import ButtonMainOption from "@/components/button-main-option";
import ThemeToggle from "@/components/theme-toggle";
import { useCurrentUser } from "@/features/auth/hooks/queries";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: RouteComponent });

function RouteComponent() {
  const { data: user } = useCurrentUser();
  console.log({ user });

  return (
    <div className="h-full">
      <header className="flex justify-between items-center">
        {!user ? <GoogleOAuthButton /> : <AccountMenu />}
        <ThemeToggle />
      </header>
      <main className="flex flex-col items-center justify-center h-3/4">
        <img width={250} src="/main-logo.png" alt="logo" />
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
    </div>
  );
}
