import { ThemeProvider } from "@/providers/theme-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { User } from "@jigsaw/shared";
import { type QueryClient } from "@tanstack/react-query";

export interface RouterAuthContext {
  auth: {
    user: User | undefined;
  };
}

export const Route = createRootRouteWithContext<
  RouterAuthContext & { queryClient: QueryClient }
>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <ThemeProvider defaultTheme="dark">
        <Outlet />
      </ThemeProvider>
      <ReactQueryDevtools />
    </>
  );
}
