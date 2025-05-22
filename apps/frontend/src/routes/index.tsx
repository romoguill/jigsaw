import ThemeToggle from "@/frontend/components/theme-toggle";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import AccountMenu from "../components/account-menu";
import {
  currentUserKey,
  currentUserQueryOptions,
} from "../features/auth/hooks/queries";
import MainMenuUser from "../components/global/menus/main-menu-user";
import MainMenuOptions from "../components/global/menus/main-menu-options";
import MainMenuSubOptions from "../components/global/menus/main-menu-suboptions";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData({ queryKey: currentUserKey });
  },
});

function RouteComponent() {
  const { data: user } = useSuspenseQuery(currentUserQueryOptions());
  const [menuStep, setMenuStep] = useState<number>(user ? 1 : 0);

  return (
    <div className="h-full container mx-auto">
      <header className="flex justify-between items-center">
        {user && (
          <AccountMenu
            onLogout={() => {
              setMenuStep(0);
            }}
          />
        )}
        <ThemeToggle />
      </header>
      <main className="flex flex-col items-center justify-center h-3/4 container mx-auto">
        <img
          width={250}
          height={250}
          className="w-[250px] h-[250px]"
          src="/main-logo.webp"
          alt="logo"
        />
        <AnimatePresence mode="wait">
          {menuStep === 0 || user === null ? (
            <MainMenuUser setMenuStep={setMenuStep} />
          ) : menuStep === 1 ? (
            <MainMenuOptions setMenuStep={setMenuStep} />
          ) : (
            <MainMenuSubOptions setMenuStep={setMenuStep} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
