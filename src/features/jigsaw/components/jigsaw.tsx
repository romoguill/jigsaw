import { useMemo } from "react";
import { generateTestingShapes } from "../../../lib/utils";
import Canvas from "./canvas";

function Jigsaw() {
  // Generate some shapes for testing
  const shapes = useMemo(() => {
    return generateTestingShapes();
  }, []);

  return <Canvas shapes={shapes} />;
}
export default Jigsaw;
