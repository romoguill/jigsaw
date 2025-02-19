import { AuthProvider } from "@/features/auth/hooks/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createRootRoute } from "@tanstack/react-router";

const queryClient = new QueryClient();

export const Route = createRootRoute({ component: RootComponent });

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
