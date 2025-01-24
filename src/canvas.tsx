import { useEffect, useRef, useState } from "react";
import useWindowSize from "./hooks/use-window-size";
import { Shape } from "./features/shapes/shape";
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

function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [shapes, setShapes] = useState<Shape[]>([]);

  const windowSize = useWindowSize();

  useEffect(() => {
    const shapes = createShapes(20);
    setShapes(shapes);
  }, []);

  // Frames
  useEffect(() => {
    let animationFrameId = 0;

    if (canvasRef.current) {
      canvasCtxRef.current = canvasRef.current.getContext("2d");

      const render = () => {
        if (!canvasCtxRef.current) return;

        const ctx = canvasCtxRef.current;
        ctx.clearRect(0, 0, windowSize.width, windowSize.height);
        drawShapes(shapes, canvasCtxRef.current!);
        animationFrameId = window.requestAnimationFrame(render);
      };

      render();
    }

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [shapes, windowSize]);

  const handleMouseDown: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    const mouseCoordinates = getMouseCoordinates(e);
    const hoveredShape = getHoveredShape(mouseCoordinates, shapes);

    hoveredShape?.setActive(true);
  };
  const handleMouseMove: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    // const mouseCoordinates = getMouseCoordinates(e);
    // const hoveredShape = getHoveredShape(mouseCoordinates, shapes);
    const mouseCoordinates = getMouseCoordinates(e);
    const hoveredShape = getHoveredShape(mouseCoordinates, shapes);

    if (hoveredShape?.active) {
      console.log(hoveredShape);
      hoveredShape.move(mouseCoordinates);
    }
  };
  const handleMouseUp: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    const mouseCoordinates = getMouseCoordinates(e);
    const hoveredShape = getHoveredShape(mouseCoordinates, shapes);

    hoveredShape?.setActive(false);
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
