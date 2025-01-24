import { useEffect, useState } from "react";
import { Coordinate } from "../types";

function useMouseCoordinate() {
  const [mouseCoordinate, setMouseCoordinate] = useState<Coordinate>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const getCoordinate = (e: MouseEvent) => {
      setMouseCoordinate({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", getCoordinate);

    return () => {
      removeEventListener("mousemove", getCoordinate);
    };
  });

  return mouseCoordinate;
}

export default useMouseCoordinate;
