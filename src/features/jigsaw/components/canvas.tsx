import { useEffect, useMemo, useState } from "react";
import useMouseCoordinate from "../../../hooks/use-mouse-coordinate";
import { useRenderLoop } from "../../../hooks/use-render-loop";
import useWindowSize from "../../../hooks/use-window-size";
import { ShapeSide } from "../../../types";
import { Shape } from "../../shapes/shape";

const drawShapes = (shapes: Shape[], ctx: CanvasRenderingContext2D) => {
  shapes.forEach((shape) => shape.draw(ctx));
};

interface CanvasProps {
  shapes: Shape[];
}

function Canvas({ shapes }: CanvasProps) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const { canvasRef } = useRenderLoop({
    draw: (ctx) => {
      drawShapes(shapes, ctx);
      if (image) {
        ctx.drawImage(image, 10, 10, 100, 100);
      }
    },
  });
  const windowSize = useWindowSize();
  const mouseCoordinate = useMouseCoordinate();

  // Check which shape is intersection with mouse. TODO: solve case where there are multiple
  const hoveredShape = useMemo(() => {
    return (
      shapes.find((shape) => shape.isIntersecting(mouseCoordinate)) ?? null
    );
  }, [mouseCoordinate, shapes]);

  useEffect(() => {
    const image = new Image();
    image.src = "/test-image.avif";
    image.onload = () => {
      setImage(image);
    };
  }, []);

  const handleMouseDown: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    hoveredShape?.onMouseDown(e);
  };

  const handleMouseMove: React.MouseEventHandler<HTMLCanvasElement> = () => {
    const activeShape = shapes.find((shape) => shape.active);

    if (activeShape) {
      activeShape.move({
        x: mouseCoordinate.x - activeShape.offset.x,
        y: mouseCoordinate.y - activeShape.offset.y,
      });
    }
  };

  const handleMouseUp: React.MouseEventHandler<HTMLCanvasElement> = () => {
    // BEFORE DEACTIVATING SHAPE, CHECK IF CAN BE STITCHED
    const activeShape = shapes.find((shape) => shape.active);

    if (activeShape) {
      // Get all shapes that the active shape could be stitched to.
      // Could be more thant one since for now, shapes can be overlapping.
      const shapesAvilableForStitching = shapes
        .map((shape) => ({
          // Don't stich to itself
          shape,
          side: activeShape.canStitch(shape),
        }))
        .filter((item) => Boolean(item.side)) as {
        shape: Shape;
        side: ShapeSide;
      }[]; // TS can't infer the boolean filter. Side will never be null

      const shapeToStitch = shapesAvilableForStitching.find((item) =>
        activeShape.shouldStitch(item.side, item.shape)
      )?.shape;

      if (shapeToStitch) activeShape.stitchTo(shapeToStitch);

      console.log(activeShape);
      activeShape?.setActive(false);
    }
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
