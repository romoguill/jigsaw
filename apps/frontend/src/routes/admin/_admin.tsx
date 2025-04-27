import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_admin")({
  component: RouteComponent,
  // beforeLoad: ({ context }) => {
  //   if (context.auth.user?.role !== "admin") {
  //     throw redirect({
  //       to: "/",
  //     });
  //   }
  // },
});

function RouteComponent() {
  return (
    <div className="h-full flex flex-col">
      <Outlet />
    </div>
  );
}
