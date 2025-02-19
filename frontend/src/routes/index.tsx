import GoogleOAuthButton from "@/components/auth/google-oauth-button";
import ButtonMainOption from "@/components/button-main-option";
import ThemeToggle from "@/components/theme-toggle";
import { apiClient } from "@/lib/api-client";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({ component: RouteComponent });

function RouteComponent() {
  useEffect(() => {
    apiClient.api
      .$get()
      .then((res) => res.text())
      .then((data) => console.log(data));
  }, []);

  return (
    <div className="h-full">
      <header className="flex justify-between items-center">
        <GoogleOAuthButton />
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
