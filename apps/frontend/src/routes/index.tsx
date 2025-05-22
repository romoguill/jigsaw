import ButtonMainOption from "@/frontend/components/button-main-option";
import ThemeToggle from "@/frontend/components/theme-toggle";
import {
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import AccountMenu from "../components/account-menu";
import { useLogin } from "../features/auth/hooks/mutations";
import {
  currentUserKey,
  currentUserQueryOptions,
} from "../features/auth/hooks/queries";
import { gameSessionsQueryOptions } from "../features/games/api/queries";
import { authClient } from "../lib/auth-client";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData({ queryKey: currentUserKey });
  },
});

function RouteComponent() {
  const { data: user } = useSuspenseQuery(currentUserQueryOptions());
  const navigate = Route.useNavigate();

  const { data: sessions } = useQuery(gameSessionsQueryOptions());
  const [menuStep, setMenuStep] = useState<number>(user ? 1 : 0);
  const { mutate: login } = useLogin();
  const queryClient = useQueryClient();

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

      {user === null && (
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

  console.log(menuStep);

  return (
    <div className="h-full container mx-auto">
      <header className="flex justify-between items-center">
        {user && (
          <AccountMenu
            onLogout={() => {
              navigate({ to: "/" });
              setMenuStep(0);
            }}
          />
        )}
        <ThemeToggle />
      </header>
      <main className="flex flex-col items-center justify-center h-3/4 container mx-auto">
        <img width={250} src="/main-logo.webp" alt="logo" />
        <AnimatePresence mode="wait">
          {menuStep === 0 && user === null ? (
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
