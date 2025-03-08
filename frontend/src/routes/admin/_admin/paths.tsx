import { apiClient } from "@/lib/api-client";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin/_admin/paths")({
  component: RouteComponent,
});

function RouteComponent() {
  const [path, setPath] = useState<string | null>(null);

  useEffect(() => {
    console.log("calling");
    apiClient.api.game.builder.path
      .$get()
      .then((res) => res.json())
      .then((data) => setPath(data.path));
  }, []);

  if (!path) return;

  return (
    <div>
      <p>{path}</p>
      <svg
        width={600}
        height={600}
        viewBox="-200 -300 1500 1300"
        className="stroke-red-500 stroke-[1%] fill-none"
      >
        <path d={path} />
      </svg>
    </div>
  );
}
