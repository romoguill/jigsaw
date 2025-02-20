import { ThemeProvider } from "@/providers/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { User } from "../../../shared/types";

const queryClient = new QueryClient();

export interface RouterAuthContext {
  auth: {
    user: User | undefined;
  };
}

export const Route = createRootRouteWithContext<RouterAuthContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <Outlet />
      </ThemeProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
