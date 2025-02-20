import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { routeTree } from "./routeTree.gen.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { currentUserKey } from "./features/auth/hooks/queries.tsx";

const router = createRouter({
  routeTree,
  context: {
    auth: { user: undefined },
  },
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={router}
        context={{ auth: { user: queryClient.getQueryData(currentUserKey) } }}
      />
    </QueryClientProvider>
  </StrictMode>
);
