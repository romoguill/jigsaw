import { usePaths } from "@/features/jigsaw-builder/api/queries";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_admin/paths")({
  component: RouteComponent,
});

const gameProps = {
  origin: { x: 0, y: 0 },
  pieceSize: 40,
  pinSize: 8,
  pieceQuantity: 30,
};

function RouteComponent() {
  const { data: paths } = usePaths(gameProps);

  if (!paths) return;

  return (
    <div>
      {/* <p>{JSON.stringify(paths)}</p> */}
      <svg
        width={600}
        height={600}
        viewBox="-200 -300 1500 1300"
        className="stroke-red-500 stroke-3 fill-none"
      >
        <g>
          {paths.horizontal.map((path, i) => (
            <path
              d={path}
              transform={`translate(0 ${i * gameProps.pieceSize})`}
            />
          ))}
        </g>

        <g transform={`rotate(90)`}>
          {paths.vertical.map((path, i) => (
            <path
              d={path}
              transform={`translate(0 ${-i * gameProps.pieceSize} )`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
