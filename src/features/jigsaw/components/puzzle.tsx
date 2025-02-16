import { Loader2 } from "lucide-react";
import { useRef } from "react";
import { Jiggsaw } from "../jigsaw";
import { usePuzzleData } from "../queries/get-shape-data";
import Canvas from "./canvas";

function Puzzle() {
  // // Generate some shapes for testing
  // const shapes = useMemo(() => {
  //   return generateTestingShapes();
  // }, []);

  const { data, isPending, isError } = usePuzzleData();
  const gameRef = useRef<Jiggsaw | null>(null);

  if (isPending) {
    return <Loader2 className="animate-spin" />;
  }

  if (isError) {
    return <p className="text-red-600/80">Error loading data for the puzzle</p>;
  }

  gameRef.current = new Jiggsaw(data);
  const jigsaw = gameRef.current;

  return <Canvas jigsaw={jigsaw} />;
}

export default Puzzle;
