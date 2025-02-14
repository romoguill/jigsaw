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

  // ----- MOUSE HANDLERS -----
  const handleMouseDown: React.MouseEventHandler<HTMLCanvasElement> =
    useCallback(() => {
      const activePiece = jigsaw.pieces.find((piece) =>
        piece.isIntersecting(mouseCoordinate)
      );

      // Register the initial mouse position and set active the group being focused.
      if (activePiece) {
        startDragCoordinateRef.current = { ...mouseCoordinate };
        activeGroupRef.current = jigsaw.groups.get(activePiece.groupId) || null;
      }
    }, [jigsaw.groups, mouseCoordinate, jigsaw.pieces]);

  const handleMouseMove: React.MouseEventHandler<HTMLCanvasElement> =
    useCallback(() => {
      if (!startDragCoordinateRef.current) return;
      if (!activeGroupRef.current) return;

      // Get the difference in coordinates from mouse initial click to dragged position.
      const delta: Coordinate = {
        x: mouseCoordinate.x - startDragCoordinateRef.current.x,
        y: mouseCoordinate.y - startDragCoordinateRef.current.y,
      };

      // Move the origin of the group, which then moves the offset of every piece
      jigsaw.moveGroup(activeGroupRef.current.id, delta);

      // After each frame, reset the start drag position to the current mouse x, y
      startDragCoordinateRef.current = { ...mouseCoordinate };
    }, [jigsaw, mouseCoordinate]);

  const handleMouseUp: React.MouseEventHandler<HTMLCanvasElement> =
    useCallback(() => {
      if (!activeGroupRef.current) return null;

      const spatialGrid = updateSpatialGrid(jigsaw.pieces);
      console.log({ spatialGrid });

      const validSnaps = jigsaw.findValidSnaps(
        activeGroupRef.current.id,
        spatialGrid
      );

      if (validSnaps.length > 0) {
        const { snappedGroupId } = validSnaps[0];
        jigsaw.snap(activeGroupRef.current.id, snappedGroupId);
      }

      startDragCoordinateRef.current = null;
      activeGroupRef.current = null;
    }, [jigsaw, updateSpatialGrid]);

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
