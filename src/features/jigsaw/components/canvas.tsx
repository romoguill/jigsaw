import { useCallback, useRef } from "react";
import useMouseCoordinate from "../../../hooks/use-mouse-coordinate";
import { useRenderLoop } from "../../../hooks/use-render-loop";
import useWindowSize from "../../../hooks/use-window-size";
import { Coordinate, ShapeSide } from "../../../types";
import { Jiggsaw, PieceGroup } from "../jigsaw";
import { PuzzlePiece } from "../puzzle-piece";

const drawShapes = (shapes: PuzzlePiece[], ctx: CanvasRenderingContext2D) => {
  shapes.forEach((shape) => shape.draw(ctx));
};

interface CanvasProps {
  jigsaw: Jiggsaw;
}

function Canvas({ jigsaw }: CanvasProps) {
  const activeGroupRef = useRef<PieceGroup | null>(null);
  const startDragCoordinateRef = useRef<Coordinate | null>(null);

  const { canvasRef } = useRenderLoop({
    draw: (ctx) => {
      drawShapes(jigsaw.pieces, ctx);
    },
  });
  const windowSize = useWindowSize();
  const mouseCoordinate = useMouseCoordinate();

  // Update spatial grid (grid for performance. Typical in game development)
  const updateSpatialGrid = useCallback(
    (pieces: PuzzlePiece[]) => {
      const grid = new Map<string, PuzzlePiece[]>();

      pieces.forEach((piece) => {
        const cellX = Math.floor(piece.position.x / jigsaw.data.pieceSize);
        const cellY = Math.floor(piece.position.y / jigsaw.data.pieceSize);
        const key = `${cellX},${cellY}`;

        if (!grid.has(key)) grid.set(key, []);
        grid.get(key)?.push(piece);
      });

      return grid;
    },
    [jigsaw.data.pieceSize]
  );

  // // Check which shape is intersecting with mouse. TODO: solve case where there are multiple
  // const hoveredShape = useMemo(() => {
  //   return (
  //     shapes.find((shape) => shape.isIntersecting(mouseCoordinate)) ?? null
  //   );
  // }, [mouseCoordinate, shapes]);

  const handleMouseDown: React.MouseEventHandler<HTMLCanvasElement> = () => {
    const activePiece = jigsaw.pieces.find((piece) =>
      piece.isIntersecting(mouseCoordinate)
    );

    // Register the initial mouse position and set active the group being focused.
    if (activePiece) {
      startDragCoordinateRef.current = mouseCoordinate;
      activeGroupRef.current = jigsaw.groups.get(activePiece.groupId) || null;
    }
  };

  const handleMouseMove: React.MouseEventHandler<HTMLCanvasElement> = () => {
    if (!startDragCoordinateRef.current) return;
    if (!activeGroupRef.current) return;

    // Get the difference in coordinates from mouse initial click to dragged position.
    const delta: Coordinate = {
      x: mouseCoordinate.x - startDragCoordinateRef.current.x,
      y: mouseCoordinate.y - startDragCoordinateRef.current.y,
    };

    jigsaw.moveGroup(activeGroupRef.current.id, delta);
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
        shape: PuzzlePiece;
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
