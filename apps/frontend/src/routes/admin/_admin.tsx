import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_admin")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (context.auth.user?.role !== "admin") {
      throw redirect({
        to: "/",
      });
    }
  },
});

function RouteComponent() {
  return (
    <main className="h-full flex flex-col">
      <Outlet />
    </main>
  );
}
