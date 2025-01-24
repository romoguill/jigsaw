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

const coordinateInsersecting = (coordinate: Coordinate, shape: Shape) => {
  return (
    coordinate.x >= shape.x &&
    coordinate.x <= shape.x + shape.width &&
    coordinate.y >= shape.y &&
    coordinate.y <= shape.y + shape.height
  );
};

const getHoveredShape = (mouseCoordinates: Coordinate, shapes: Shape[]) => {
  return (
    shapes.find((shape) => coordinateInsersecting(mouseCoordinates, shape)) ??
    null
  );
};

function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [shapes, setShapes] = useState<Shape[]>([]);

  const windowSize = useWindowSize();

  useEffect(() => {
    if (canvasRef.current) {
      canvasCtxRef.current = canvasRef.current.getContext("2d");

      const ctx = canvasCtxRef.current!;

      drawShapes(shapes, ctx);
    }
  }, [shapes]);

  useEffect(() => {
    const shapes = createShapes(20);
    setShapes(shapes);
  }, []);

  const handleMouseDown: React.MouseEventHandler<HTMLCanvasElement> = () => {};
  const handleMouseMove: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    const mouseCoordinates = getMouseCoordinates(e);
    const hoveredShape = getHoveredShape(mouseCoordinates, shapes);
    console.log({ hoveredShape });
  };
  const handleMouseUp: React.MouseEventHandler<HTMLCanvasElement> = () => {};
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
