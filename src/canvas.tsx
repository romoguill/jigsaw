import { useCallback, useEffect, useRef } from "react";
import { Shape } from "./features/shapes/shape";
import useWindowSize from "./hooks/use-window-size";
import { getMouseCoordinates } from "./lib/utils";
import { Coordinate } from "./types";

const createShapes = (n: number) => {
  const shapes: Shape[] = [];
  for (let i = 0; i < n; i++) {
    shapes.push(
      new Shape(
        Math.floor(Math.random() * 500),
        Math.floor(Math.random() * 500)
      )
    );
  }

  return shapes;
};

const drawShapes = (shapes: Shape[], ctx: CanvasRenderingContext2D) => {
  shapes.forEach((shape) => shape.draw(ctx));
};

const getHoveredShape = (mouseCoordinates: Coordinate, shapes: Shape[]) => {
  return shapes.find((shape) => shape.isIntersecting(mouseCoordinates)) ?? null;
};

const SHAPES = createShapes(3);

function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  const windowSize = useWindowSize();

  const draw = useCallback(() => {
    if (canvasCtxRef.current) {
      drawShapes(SHAPES, canvasCtxRef.current);
    }
  }, []);

  // Render loop
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
        draw();

        // Get new frame for unmounting effect
        animationFrameId = window.requestAnimationFrame(render);
      };

      render();
    }

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [draw, windowSize]);

  const handleMouseDown: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    const mouseCoordinates = getMouseCoordinates(e);
    const hoveredShape = getHoveredShape(mouseCoordinates, SHAPES);
    hoveredShape?.onMouseDown(e);
  };
  const handleMouseMove: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    // const mouseCoordinates = getMouseCoordinates(e);
    // const hoveredShape = getHoveredShape(mouseCoordinates, shapes);
    const mouseCoordinates = getMouseCoordinates(e);
    const activeShape = SHAPES.find((shape) => shape.active);

    if (activeShape?.active) {
      activeShape.move({
        x: mouseCoordinates.x - activeShape.offset.x,
        y: mouseCoordinates.y - activeShape.offset.y,
      });
    }
  };
  const handleMouseUp: React.MouseEventHandler<HTMLCanvasElement> = () => {
    SHAPES.forEach((shape) => shape.onMouseUp());
  };
  const handleTouchStart: React.TouchEventHandler<HTMLCanvasElement> = () => {};
  const handleTouchMove: React.TouchEventHandler<HTMLCanvasElement> = () => {};
  const handleTouchEnd: React.TouchEventHandler<HTMLCanvasElement> = () => {};

  return (
    <canvas
      ref={canvasRef}
      width={windowSize.width}
      height={windowSize.height}
      className="bg-slate-950"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    ></canvas>
  );
}

export default Canvas;
