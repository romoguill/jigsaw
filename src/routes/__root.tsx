import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { ThemeProvider } from "@/providers/theme-provider";

export const Route = createRootRoute({ component: RootComponent });

function RootComponent() {
  return (
    <React.Fragment>
      <ThemeProvider defaultTheme="dark">
        <Outlet />
      </ThemeProvider>
    </React.Fragment>
  );
}
