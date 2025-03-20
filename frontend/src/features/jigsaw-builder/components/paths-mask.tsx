import { Paths } from "../../../../../server/shared/types";

interface PathsMaskProps {
  paths: Paths;
  pieceSize: number;
  scale: number;
}

function PathsMask({ paths, pieceSize, scale }: PathsMaskProps) {
  return (
    <svg
      // viewBox="-200 -300 1500 1300"
      className="stroke-red-500 stroke-3 fill-none w-full absolute top-0 h-full"
    >
      <g>
        {paths.horizontal.map((path, i) => (
          <path
            key={i}
            d={path}
            transform={`translate(0 ${i * pieceSize * scale}) scale(${scale})`}
          />
        ))}
      </g>

      <g transform={`rotate(90)`}>
        {paths.vertical.map((path, i) => (
          <path
            key={i}
            d={path}
            transform={`translate(0 ${-i * pieceSize * scale} ) scale(${scale})`}
          />
        ))}
      </g>
    </svg>
  );
}
export default PathsMask;
