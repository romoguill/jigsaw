import GoogleOAuthButton from "@/frontend/components/auth/google-oauth-button";
import ButtonMainOption from "@/frontend/components/button-main-option";
import ThemeToggle from "@/frontend/components/theme-toggle";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { gameSessionsQueryOptions } from "../features/games/api/queries";
import { authClient } from "../lib/auth-client";
import AccountMenu from "../components/account-menu";
import { currentUserKey, useCurrentUser } from "../features/auth/hooks/queries";
import { useLogin } from "../features/auth/hooks/mutations";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    auth: { user },
  } = Route.useRouteContext();

  const { data: sessions } = useQuery(gameSessionsQueryOptions());
  const { data: currentUser } = useCurrentUser();
  const [menuStep, setMenuStep] = useState<number>(0);
  const { mutate: login } = useLogin();
  const queryClient = useQueryClient();

  console.log({ currentUser });
  const UserMenu = () => (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-4"
    >
      <ButtonMainOption
        onClick={async () => {
          await authClient.signIn.anonymous();
          queryClient.invalidateQueries({ queryKey: currentUserKey });
          setMenuStep(1);
        }}
      >
        Play as Guest
      </ButtonMainOption>
      <ButtonMainOption
        onClick={() => login(undefined, { onSuccess: () => setMenuStep(1) })}
      >
        Login with Google
      </ButtonMainOption>
    </motion.div>
  );

  const MainMenu = () => (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-4"
    >
      {sessions && sessions.length > 0 && (
        <Link to="/games/active">
          <ButtonMainOption>Continue</ButtonMainOption>
        </Link>
      )}
      <ButtonMainOption onClick={() => setMenuStep(2)}>
        New Game
      </ButtonMainOption>

      {currentUser === null && (
        <ButtonMainOption onClick={() => setMenuStep(0)}>Back</ButtonMainOption>
      )}
    </motion.div>
  );

  const SubMenu = () => (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-4"
    >
      <Link to="/games">
        <ButtonMainOption>Existing Games</ButtonMainOption>
      </Link>
      <Link to="/games/customization">
        <ButtonMainOption>Custom Game</ButtonMainOption>
      </Link>
      <ButtonMainOption onClick={() => setMenuStep(1)}>Back</ButtonMainOption>
    </motion.div>
  );

  return (
    <div className="h-full container mx-auto">
      <header className="flex justify-between items-center">
        {!user ? <GoogleOAuthButton /> : <AccountMenu />}
        <ThemeToggle />
      </header>
      <main className="flex flex-col items-center justify-center h-3/4 container mx-auto">
        <img width={250} src="/main-logo.webp" alt="logo" />
        <AnimatePresence mode="wait">
          {menuStep === 0 && currentUser === null ? (
            <UserMenu />
          ) : menuStep === 1 ? (
            <MainMenu />
          ) : (
            <SubMenu />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
