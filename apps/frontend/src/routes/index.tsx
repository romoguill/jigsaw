import AccountMenu from "@/frontend/components/account-menu";
import GoogleOAuthButton from "@/frontend/components/auth/google-oauth-button";
import ButtonMainOption from "@/frontend/components/button-main-option";
import ThemeToggle from "@/frontend/components/theme-toggle";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { gameSessionsQueryOptions } from "../features/games/api/queries";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    auth: { user },
  } = Route.useRouteContext();

  const { data: sessions } = useQuery(gameSessionsQueryOptions());
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  const MainMenu = () => (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-4"
    >
      {sessions && sessions.length > 0 && (
        <Link to="/games/active">
          <ButtonMainOption>Continue</ButtonMainOption>
        </Link>
      )}
      <ButtonMainOption onClick={() => setIsSubmenuOpen(true)}>
        New Game
      </ButtonMainOption>
      <ButtonMainOption>Join with ID</ButtonMainOption>
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
      <Link to="/games">
        <ButtonMainOption>Custom Game</ButtonMainOption>
      </Link>
      <ButtonMainOption onClick={() => setIsSubmenuOpen(false)}>
        Back
      </ButtonMainOption>
    </motion.div>
  );

  return (
    <div className="h-full">
      <header className="flex justify-between items-center">
        {!user ? <GoogleOAuthButton /> : <AccountMenu />}
        <ThemeToggle />
      </header>
      <main className="flex flex-col items-center justify-center h-3/4">
        <img width={250} src="/main-logo.png" alt="logo" />
        <AnimatePresence mode="wait">
          {!isSubmenuOpen ? <MainMenu /> : <SubMenu />}
        </AnimatePresence>
      </main>
    </div>
  );
}
