import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useCurrentUser } from "./features/auth/hooks/queries.tsx";
import "./index.css";
import { routeTree } from "./routeTree.gen.ts";

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: {
    auth: { user: undefined },
    queryClient,
  },
});

// eslint-disable-next-line react-refresh/only-export-components
function App() {
  const { data: user, isPending } = useCurrentUser();

  if (isPending) return;

  return <RouterProvider router={router} context={{ auth: { user } }} />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
