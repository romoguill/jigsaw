import { useEffect, useRef } from "react";
import useWindowSize from "./hooks/use-window-size";

// interface CanvasProps {}

function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  const windowSize = useWindowSize();

  useEffect(() => {
    if (canvasRef.current) {
      canvasCtxRef.current = canvasRef.current.getContext("2d");

      const ctx = canvasCtxRef.current!;

      ctx.beginPath();
      ctx.arc(95, 50, 40, 0, 2 * Math.PI);
      ctx.stroke();
    }
  });

  return (
    <canvas
      ref={canvasRef}
      width={windowSize.width}
      height={windowSize.height}
      className="bg-slate-950"
    ></canvas>
  );
}

export default Canvas;
