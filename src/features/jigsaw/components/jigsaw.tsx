import { useMemo } from "react";
import Canvas from "./canvas";
import { generateRandomShapes } from "../../../lib/utils";

function Jigsaw() {
  // Generate some shapes for testing
  const shapes = useMemo(() => {
    return generateRandomShapes(5);
  }, []);

  return <Canvas shapes={shapes} />;
}
export default Jigsaw;
