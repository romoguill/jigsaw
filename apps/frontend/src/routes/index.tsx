import AccountMenu from "@/frontend/components/account-menu";
import GoogleOAuthButton from "@/frontend/components/auth/google-oauth-button";
import ButtonMainOption from "@/frontend/components/button-main-option";
import ThemeToggle from "@/frontend/components/theme-toggle";
import { createFileRoute, Link } from "@tanstack/react-router";
import { gameSessionsQueryOptions } from "../features/games/api/queries";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(gameSessionsQueryOptions());
  },
});

function RouteComponent() {
  const {
    auth: { user },
  } = Route.useRouteContext();

  const { data: sessions } = useSuspenseQuery(gameSessionsQueryOptions());

  return (
    <div className="h-full">
      <header className="flex justify-between items-center">
        {!user ? <GoogleOAuthButton /> : <AccountMenu />}
        <ThemeToggle />
      </header>
      <main className="flex flex-col items-center justify-center h-3/4">
        <img width={250} src="/main-logo.png" alt="logo" />
        <ul className="flex flex-col gap-4">
          {sessions.length > 0 && (
            <li>
              <Link to="/games/active">
                <ButtonMainOption>Continue</ButtonMainOption>
              </Link>
            </li>
          )}
          <li>
            <Link to="/games">
              <ButtonMainOption>New Game</ButtonMainOption>
            </Link>
          </li>
          <li>
            <ButtonMainOption>Join with ID</ButtonMainOption>
          </li>
        </ul>
      </main>
    </div>
  );
}
