import { Shape } from "./features/shapes/shape";
import { useRenderLoop } from "./hooks/use-render-loop";
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

const draw = (ctx: CanvasRenderingContext2D) => {
  drawShapes(SHAPES, ctx);
};

function Canvas() {
  const { canvasRef } = useRenderLoop({ draw });
  const windowSize = useWindowSize();

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
