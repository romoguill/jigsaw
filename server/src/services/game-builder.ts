import type { Coordinate } from '../../shared/types.js';
import { Path } from '../core/path.js';

type PinType = 'inside' | 'outside';
type SideType = 'start' | 'end';

type CreatePathProps = {
  origin: Coordinate;
  pieceSize: number;
  pieceQuantity: number;
};

export function createPath({
  origin,
  pieceSize,
  pieceQuantity,
}: CreatePathProps): string {
  // Detail will determine the amount of curves the shape will have. For now I am thinking 2 for the corners, 2 for the pin sides and 1 for the pin top. That 5 curves. Curves = detail * 5.
  // if (detail < 1) {
  //   throw new Error('Minimum detail must be 1');
  // }
  const moveToOrigin = `M ${origin.x} ${origin.y}`;
  const pinSize = 0.2 * pieceSize;
  let path: string = moveToOrigin;

  for (let i = 0; i < pieceQuantity; i++) {
    const flatBodyPath1 = createFlatBodyPath({
      pinType: 'outside',
      pieceSize,
      pinSize,
      config: {
        startControlPointAngleRange: [(1 / 3) * Math.PI, -(1 / 3) * Math.PI],
        endControlPointAngleRange: [(1 / 3) * Math.PI, -(1 / 3) * Math.PI],
        maxMagnitudeControlPoint: pieceSize / 5,
        startPoint: {
          x: 0,
          y: 0,
        },
      },
    });

    const pinSidePath1 = createPinSidePath({
      pinType: 'outside',
      sideType: 'start',
      pieceSize,
      pinSize,
      config: {
        endControlPointAngleRange: [Math.PI, (5 / 3) * Math.PI],
        maxMagnitudeControlPoint: pinSize / 4,
        startPoint: flatBodyPath1.endPoint,
      },
    });

    const pinTopPath = createPinTopPath({
      pinType: 'outside',
      pieceSize,
      pinSize,
      config: {
        endControlPointAngleRange: [(1 / 12) * Math.PI, (11 / 12) * Math.PI],
        maxMagnitudeControlPoint: pinSize / 4,
        startPoint: pinSidePath1.endPoint,
      },
    });

    const pinSidePath2 = createPinSidePath({
      pinType: 'outside',
      sideType: 'end',
      pieceSize,
      pinSize,
      config: {
        endControlPointAngleRange: [(7 / 12) * Math.PI, (5 / 4) * Math.PI],
        maxMagnitudeControlPoint: pinSize / 4,
        startPoint: pinTopPath.endPoint,
      },
    });

    const flatBodyPath2 = createFlatBodyPath({
      pinType: 'outside',
      pieceSize,
      pinSize,
      config: {
        endControlPointAngleRange: [(2 / 3) * Math.PI, (4 / 3) * Math.PI],
        maxMagnitudeControlPoint: pieceSize / 5,
        startPoint: pinSidePath2.endPoint,
      },
    });

    path += [
      flatBodyPath1.path,
      pinSidePath1.path,
      pinTopPath.path,
      pinSidePath2.path,
      flatBodyPath2.path,
    ].join(' ');
  }

  console.log({ pieceSize, pinSize });
  const newPath = new Path(origin, pieceSize, pinSize, pieceQuantity);

  console.log(newPath.path);

  newPath.generateCompletePath(5);

  console.log(newPath.toString());

  return path;
}

export function createCurveStart(
  ...args: [
    startControlPointX: number,
    startControlPointY: number,
    endControlPointX: number,
    endControlPointY: number,
    endPointX: number,
    endPointY: number
  ]
) {
  const parsedInputs = Array.from(args).map((arg) => arg.toFixed(2));
  return `C ${parsedInputs.join(' ')}`;
}

export function createCurve(
  ...args: [
    endControlPointX: number,
    endControlPointY: number,
    endPointX: number,
    endPointY: number
  ]
) {
  const parsedInputs = Array.from(args).map((arg) => arg.toFixed(2));
  return `S ${parsedInputs.join(' ')}`;
}

// To have a smooth transition, the control point on the previous curve must be parallel to the current curve, but opposite. In other words the vector can be any magnitude but opposite direction.
export function getOppositeUnitVector(
  previousControlPoint: Coordinate,
  previousEndPoint: Coordinate
) {
  const vector = {
    x: previousControlPoint.x - previousEndPoint.x,
    y: previousControlPoint.y - previousEndPoint.y,
  };

  const vectorMagnitude = Math.sqrt(
    Math.pow(vector.x, 2) + Math.pow(vector.y, 2)
  );

  const unitVector = {
    coordinates: {
      x: vector.x / vectorMagnitude,
      y: vector.y / vectorMagnitude,
    },
    angle: (Math.atan2(-vector.y, vector.x) + 2 * Math.PI) % (2 * Math.PI),
  };

  const oppositeUnitVector = {
    coordinates: {
      x: -unitVector.coordinates.x,
      y: -unitVector.coordinates.y,
    },
    angle:
      (Math.atan2(unitVector.coordinates.y, -unitVector.coordinates.x) +
        2 * Math.PI) %
      (2 * Math.PI),
  };

  return oppositeUnitVector;
}

interface CreateFlatBodyPathProps {
  pinType: PinType;
  pinSize: number;
  pieceSize: number;
  config: {
    startControlPointAngleRange?: [number, number];
    endControlPointAngleRange: [number, number];
    maxMagnitudeControlPoint: number;
    startPoint: Coordinate;
  };
}

function createFlatBodyPath({
  pinType,
  pinSize,
  pieceSize,
  config: {
    startControlPointAngleRange,
    endControlPointAngleRange,
    maxMagnitudeControlPoint,
    startPoint,
  },
}: CreateFlatBodyPathProps) {
  // const maxF = (maxAngleControlPointStart + minAngleControlPointEnd) / Math.PI;

  const endPoint = {
    x: pieceSize / 2 - pinSize / 2 + startPoint.x,
    y: 0 + startPoint.y,
  };

  // maxMagnitud X Factor as minimum value. Found by trial en error
  const controlPointStartMagnitud =
    maxMagnitudeControlPoint * 0.3 + Math.random() * maxMagnitudeControlPoint;
  const controlPointEndMagnitud =
    maxMagnitudeControlPoint * 0.3 + Math.random() * maxMagnitudeControlPoint;

  const beta =
    (Math.random() *
      (endControlPointAngleRange[1] - endControlPointAngleRange[0]) +
      endControlPointAngleRange[0]) %
    (2 * Math.PI);

  const controlPointEnd = {
    x: endPoint.x + controlPointEndMagnitud * Math.cos(beta),
    y: endPoint.y - controlPointEndMagnitud * Math.sin(beta), // y is inverted in paths: y positive below
  };

  let alpha: number;
  let controlPointStart: Coordinate;

  if (startControlPointAngleRange !== undefined) {
    alpha =
      (Math.random() *
        (startControlPointAngleRange[0] - startControlPointAngleRange[1]) +
        startControlPointAngleRange[1]) %
      (2 * Math.PI);

    controlPointStart = {
      x: startPoint.x + controlPointStartMagnitud * Math.cos(alpha),
      y: startPoint.y - controlPointStartMagnitud * Math.sin(alpha), // y is inverted in paths: y positive below
    };

    const path = createCurveStart(
      controlPointStart.x,
      controlPointStart.y,
      controlPointEnd.x,
      controlPointEnd.y,
      endPoint.x,
      endPoint.y
    );

    return { path, endPoint, controlPointEnd };
  }

  const path = createCurve(
    controlPointEnd.x,
    controlPointEnd.y,
    endPoint.x,
    endPoint.y
  );

  return { path, endPoint, controlPointEnd };
}

interface CreatePinSidePathProps {
  pinType: PinType;
  sideType: SideType;
  pinSize: number;
  pieceSize: number;
  config: {
    startControlPointAngleRange?: [number, number];
    endControlPointAngleRange: [number, number];
    maxMagnitudeControlPoint: number;
    startPoint: Coordinate;
  };
}

function createPinSidePath({
  pinType,
  sideType,
  pinSize,
  pieceSize,
  config: {
    startControlPointAngleRange,
    endControlPointAngleRange,
    maxMagnitudeControlPoint,
    startPoint,
  },
}: CreatePinSidePathProps) {
  // const maxF = (maxAngleControlPointStart + minAngleControlPointEnd) / Math.PI;

  let endPoint: Coordinate;

  // Determine the endPoint based on if the pin goes inside or outside of the piece and if it's the start or end of the pin (then pin is made of 2 sides and one top curves)
  if (pinType === 'inside') {
    if (sideType === 'start') {
      endPoint = {
        x: startPoint.x,
        y: startPoint.y + pinSize,
      };
    } else {
      endPoint = {
        x: startPoint.x,
        y: startPoint.y - pinSize,
      };
    }
  } else {
    if (sideType === 'start') {
      endPoint = {
        x: startPoint.x,
        y: startPoint.y - pinSize,
      };
    } else {
      endPoint = {
        x: startPoint.x,
        y: startPoint.y + pinSize,
      };
    }
  }

  const controlPointStartMagnitud =
    maxMagnitudeControlPoint * 0.3 + Math.random() * maxMagnitudeControlPoint;
  const controlPointEndMagnitud =
    maxMagnitudeControlPoint * 0.3 + Math.random() * maxMagnitudeControlPoint;
  const beta =
    (Math.random() *
      (endControlPointAngleRange[1] - endControlPointAngleRange[0]) +
      endControlPointAngleRange[0]) %
    (2 * Math.PI);

  const controlPointEnd = {
    x: endPoint.x + controlPointEndMagnitud * Math.cos(beta),
    y: endPoint.y - controlPointEndMagnitud * Math.sin(beta), // y is inverted in paths: y positive below
  };

  let alpha: number;
  let controlPointStart: Coordinate;

  if (startControlPointAngleRange !== undefined) {
    alpha =
      (Math.random() *
        (startControlPointAngleRange[0] - startControlPointAngleRange[1]) +
        startControlPointAngleRange[1]) %
      (2 * Math.PI);

    controlPointStart = {
      x: startPoint.x + controlPointStartMagnitud * Math.cos(alpha),
      y: startPoint.y - controlPointStartMagnitud * Math.sin(alpha), // y is inverted in paths: y positive below
    };

    const path = createCurveStart(
      controlPointStart.x,
      controlPointStart.y,
      controlPointEnd.x,
      controlPointEnd.y,
      endPoint.x,
      endPoint.y
    );

    return { path, endPoint, controlPointEnd };
  }

  const path = createCurve(
    controlPointEnd.x,
    controlPointEnd.y,
    endPoint.x,
    endPoint.y
  );

  return { path, endPoint, controlPointEnd };
}
interface CreatePinTopPathProps {
  pinType: PinType;
  pinSize: number;
  pieceSize: number;

  config: {
    startControlPointAngleRange?: [number, number];
    endControlPointAngleRange: [number, number];
    maxMagnitudeControlPoint: number;
    startPoint: Coordinate;
  };
}

function createPinTopPath({
  pinType,
  pinSize,
  pieceSize,
  config: {
    startControlPointAngleRange,
    endControlPointAngleRange,
    maxMagnitudeControlPoint,
    startPoint,
  },
}: CreatePinTopPathProps) {
  // const maxF = (maxAngleControlPointStart + minAngleControlPointEnd) / Math.PI;
  const endPoint = {
    x: startPoint.x + pinSize,
    y: startPoint.y,
  };

  const controlPointStartMagnitud =
    maxMagnitudeControlPoint * 0.3 + Math.random() * maxMagnitudeControlPoint;
  const controlPointEndMagnitud =
    maxMagnitudeControlPoint * 0.3 + Math.random() * maxMagnitudeControlPoint;
  const beta =
    (Math.random() *
      (endControlPointAngleRange[1] - endControlPointAngleRange[0]) +
      endControlPointAngleRange[0]) %
    (2 * Math.PI);

  const controlPointEnd = {
    x: endPoint.x + controlPointEndMagnitud * Math.cos(beta),
    y: endPoint.y - controlPointEndMagnitud * Math.sin(beta), // y is inverted in paths: y positive below
  };

  let alpha: number;
  let controlPointStart: Coordinate;

  if (startControlPointAngleRange !== undefined) {
    alpha =
      (Math.random() *
        (startControlPointAngleRange[0] - startControlPointAngleRange[1]) +
        startControlPointAngleRange[1]) %
      (2 * Math.PI);

    controlPointStart = {
      x: startPoint.x + controlPointStartMagnitud * Math.cos(alpha),
      y: startPoint.y - controlPointStartMagnitud * Math.sin(alpha), // y is inverted in paths: y positive below
    };

    const path = createCurveStart(
      controlPointStart.x,
      controlPointStart.y,
      controlPointEnd.x,
      controlPointEnd.y,
      endPoint.x,
      endPoint.y
    );

    return { path, endPoint, controlPointEnd };
  }

  const path = createCurve(
    controlPointEnd.x,
    controlPointEnd.y,
    endPoint.x,
    endPoint.y
  );

  return { path, endPoint, controlPointEnd };
}
