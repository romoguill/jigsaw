import { apiClient } from "@/lib/api-client";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin/_admin/path")({
  component: RouteComponent,
});

function RouteComponent() {
  const [path, setPath] = useState<string[]>([]);

  useEffect(() => {
    const fetchPath = async () => {
      const res = await apiClient.api.game.builder[":gameId"].pieces.$post({
        param: { gameId: "4" },
      });
      const data = await res.json();
      setPath(data.pieces);
    };
    fetchPath();
  }, []);

  return (
    <svg
      className="stroke-white/60 stroke-[10] fill-none absolute top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%]"
      width={1000}
      height={800}
      viewBox="0 0 1900 1900"
    >
      {path.map((p, i) => (
        <path key={i} d={p} fill="none" stroke="white" />
      ))}
    </svg>
  );
}
