import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";
import { useCurrentUser } from "./features/auth/hooks/queries.tsx";
import "./index.css";
import { routeTree } from "./routeTree.gen.ts";
import { Toaster } from "./components/ui/sonner.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
});

const router = createRouter({
  routeTree,
  context: {
    auth: { user: null },
    queryClient,
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// eslint-disable-next-line react-refresh/only-export-components
function App() {
  const { data: user, isPending } = useCurrentUser();

  if (isPending) return null;

  return (
    <RouterProvider
      router={router}
      context={{ auth: { user: user ?? null } }}
    />
  );
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <Toaster />
  </QueryClientProvider>
);
