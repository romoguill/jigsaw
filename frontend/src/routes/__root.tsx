import { AuthProvider } from "@/features/users/hooks/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRoute } from "@tanstack/react-router";

const queryClient = new QueryClient();

export const Route = createRootRoute({ component: RootComponent });

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark">
          <Outlet />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
