import { useCallback, useEffect, useRef, useState } from "react";
import useMouseCoordinate from "../../../hooks/use-mouse-coordinate";
import { useRenderLoop } from "../../../hooks/use-render-loop";
import useWindowSize from "../../../hooks/use-window-size";
import { Coordinate } from "../../../types";
import { Jiggsaw, PieceGroup } from "../jigsaw";
import { PuzzlePiece } from "../puzzle-piece";
import useGameStore from "@/frontend/store/game-store";

const drawShapes = (shapes: PuzzlePiece[], ctx: CanvasRenderingContext2D) => {
  // Sort shapes by zIndex, so that active piece is on top
  shapes.sort((a, b) => a.zIndex - b.zIndex);
  shapes.forEach((shape) => shape.draw(ctx));
  const a = shapes.filter((shape) => shape.zIndex === 1);

  if (a.length) console.log(a);
};

// Draw three circles that scale in sequence
const drawLoadingCircles = (ctx: CanvasRenderingContext2D, time: number) => {
  const centerX = ctx.canvas.width / 2;
  const centerY = ctx.canvas.height / 2;
  const circleRadius = 15;
  const spacing = 60;
  const animationSpeed = 0.04;
  const baseScale = 0.5;
  const maxScale = 1.5;

  // Clear the canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Draw three circles with sequential scaling animation
  for (let i = 0; i < 3; i++) {
    // Calculate phase offset for each circle
    const phase = time * animationSpeed + (i * Math.PI) / 3.5;

    // Calculate scale using sine wave for smooth animation
    const scale =
      baseScale + ((Math.sin(phase) + 1) * (maxScale - baseScale)) / 2;

    // Calculate position for each circle
    const x = centerX - spacing + i * spacing;

    // Draw the circle
    ctx.beginPath();
    ctx.arc(x, centerY, circleRadius * scale, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(163, 168, 191, ${0.3 + (0.7 * scale) / maxScale})`;
    ctx.fill();
  }
};

interface CanvasProps {
  jigsaw: Jiggsaw;
  onPieceMove?: () => void;
}

function Canvas({ jigsaw, onPieceMove }: CanvasProps) {
  const { resumeTimer } = useGameStore();
  const activeGroupRef = useRef<PieceGroup | null>(null);
  const startDragCoordinateRef = useRef<Coordinate | null>(null);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const animationTimeRef = useRef(0);

  const { canvasRef } = useRenderLoop({
    draw: (ctx) => {
      if (allImagesLoaded) {
        drawShapes(jigsaw.pieces, ctx);
      } else {
        // Draw loading circles animation
        animationTimeRef.current += 1;
        drawLoadingCircles(ctx, animationTimeRef.current);
      }
    },
  });
  const windowSize = useWindowSize();
  const mouseCoordinate = useMouseCoordinate();

  // Check if all images are loaded
  useEffect(() => {
    const checkLoading = () => {
      const loaded = jigsaw.checkAllPiecesLoaded();
      setAllImagesLoaded(loaded);

      if (!loaded) {
        // Continue checking until all images are loaded
        setTimeout(checkLoading, 100);
      } else {
        resumeTimer();
      }
    };

    checkLoading();
  }, [jigsaw, resumeTimer]);

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
      if (!allImagesLoaded) return;

      const activePiece = jigsaw.pieces.find((piece) =>
        piece.isIntersecting(mouseCoordinate)
      );

      activePiece?.setActive(true);

      // Register the initial mouse position and set active the group being focused.
      if (activePiece) {
        startDragCoordinateRef.current = { ...mouseCoordinate };
        activeGroupRef.current = jigsaw.groups.get(activePiece.groupId) || null;
      }
    }, [jigsaw.groups, mouseCoordinate, jigsaw.pieces, allImagesLoaded]);

  const handleMouseMove: React.MouseEventHandler<HTMLCanvasElement> =
    useCallback(() => {
      if (!startDragCoordinateRef.current) return;
      if (!activeGroupRef.current) return;
      if (!allImagesLoaded) return;

      // Get the difference in coordinates from mouse initial click to dragged position.
      const delta: Coordinate = {
        x: mouseCoordinate.x - startDragCoordinateRef.current.x,
        y: mouseCoordinate.y - startDragCoordinateRef.current.y,
      };

      // Move the origin of the group, which then moves the offset of every piece
      jigsaw.moveGroup(activeGroupRef.current.id, delta);

      // After each frame, reset the start drag position to the current mouse x, y
      startDragCoordinateRef.current = { ...mouseCoordinate };
    }, [jigsaw, mouseCoordinate, allImagesLoaded]);

  const handleMouseUp: React.MouseEventHandler<HTMLCanvasElement> =
    useCallback(() => {
      if (!activeGroupRef.current) return null;
      if (!allImagesLoaded) return;

      const spatialGrid = updateSpatialGrid(jigsaw.pieces);

      const validSnaps = jigsaw.findValidSnaps(
        activeGroupRef.current.id,
        spatialGrid
      );

      if (validSnaps.length > 0) {
        const { snappedGroupId, delta } = validSnaps[0];
        jigsaw.snap(activeGroupRef.current.id, snappedGroupId, delta);
      }

      jigsaw.pieces.forEach((piece) => piece.setActive(false));

      startDragCoordinateRef.current = null;
      activeGroupRef.current = null;

      // Notify parent that pieces were moved
      onPieceMove?.();
    }, [jigsaw, updateSpatialGrid, allImagesLoaded, onPieceMove]);

  return (
    <canvas
      ref={canvasRef}
      width={windowSize.width}
      height={windowSize.height}
      className="bg-slate-950 w-full h-full"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
}

export default Canvas;
