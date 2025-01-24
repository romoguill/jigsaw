import { useEffect, useRef } from "react";
import useWindowSize from "./use-window-size";

interface useRenderLoopProps {
  draw: (ctx: CanvasRenderingContext2D) => void;
}

export function useRenderLoop({ draw }: useRenderLoopProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  const windowSize = useWindowSize();

  useEffect(() => {
    let animationFrameId = 0;

    if (canvasRef.current) {
      canvasCtxRef.current = canvasRef.current.getContext("2d");

      // Recursive render
      const render = () => {
        if (!canvasCtxRef.current) return;

        const ctx = canvasCtxRef.current;

        // Clear previous render
        ctx.clearRect(0, 0, windowSize.width, windowSize.height);

        // Draw updated shapes
        draw(ctx);

        // Get new frame for unmounting effect
        animationFrameId = window.requestAnimationFrame(render);
      };

      render();
    }

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [draw, windowSize]);

  return {
    canvasRef,
  };
}
