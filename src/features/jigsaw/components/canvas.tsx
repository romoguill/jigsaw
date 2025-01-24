import { Shape } from "../../shapes/shape";
import { useRenderLoop } from "../../../hooks/use-render-loop";
import useWindowSize from "../../../hooks/use-window-size";
import { getMouseCoordinates } from "../../../lib/utils";
import { Coordinate } from "../../../types";

const drawShapes = (shapes: Shape[], ctx: CanvasRenderingContext2D) => {
  shapes.forEach((shape) => shape.draw(ctx));
};

const getHoveredShape = (mouseCoordinates: Coordinate, shapes: Shape[]) => {
  return shapes.find((shape) => shape.isIntersecting(mouseCoordinates)) ?? null;
};

interface CanvasProps {
  shapes: Shape[];
}

function Canvas({ shapes }: CanvasProps) {
  const { canvasRef } = useRenderLoop({
    draw: (ctx) => drawShapes(shapes, ctx),
  });
  const windowSize = useWindowSize();

  const handleMouseDown: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    const mouseCoordinates = getMouseCoordinates(e);
    const hoveredShape = getHoveredShape(mouseCoordinates, shapes);
    hoveredShape?.onMouseDown(e);
  };
  const handleMouseMove: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    // const mouseCoordinates = getMouseCoordinates(e);
    // const hoveredShape = getHoveredShape(mouseCoordinates, shapes);
    const mouseCoordinates = getMouseCoordinates(e);
    const activeShape = shapes.find((shape) => shape.active);

    if (activeShape?.active) {
      activeShape.move({
        x: mouseCoordinates.x - activeShape.offset.x,
        y: mouseCoordinates.y - activeShape.offset.y,
      });
    }
  };

  const handleMouseUp: React.MouseEventHandler<HTMLCanvasElement> = () => {
    shapes.forEach((shape) => shape.onMouseUp());
  };

  return (
    <canvas
      ref={canvasRef}
      width={windowSize.width}
      height={windowSize.height}
      className="bg-slate-950"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
}

export default Canvas;
