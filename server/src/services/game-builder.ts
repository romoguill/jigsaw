import type { Coordinate } from '../../shared/types.js';

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
    path +=
      ' ' +
      createFlatBodyPath({
        pinType: 'outside',
        pieceSize,
        pinSize,
        config: {
          startControlPointAngleRange: [(1 / 3) * Math.PI, -(1 / 3) * Math.PI],
          endControlPointAngleRange: [(2 / 3) * Math.PI, (4 / 3) * Math.PI],
          maxMagnitudeControlPoint: pieceSize / 5,
          startPoint: {
            x: 0,
            y: 0,
          },
        },
      });

    path +=
      ' ' +
      createPinSidePath({
        pinType: 'outside',
        sideType: 'start',
        pieceSize,
        pinSize,
        config: {
          startControlPointAngleRange: [(1 / 3) * Math.PI, (1 / 3) * Math.PI],
          endControlPointAngleRange: [Math.PI, (5 / 3) * Math.PI],
          maxMagnitudeControlPoint: pinSize / 4,
          startPoint: {
            x: pieceSize / 2 - pinSize / 2,
            y: 0,
          },
        },
      });

    path +=
      ' ' +
      createPinTopPath({
        pinType: 'outside',
        pieceSize,
        pinSize,
        config: {
          startControlPointAngleRange: [
            (1 / 12) * Math.PI,
            (11 / 12) * Math.PI,
          ],
          endControlPointAngleRange: [(1 / 12) * Math.PI, (11 / 12) * Math.PI],
          maxMagnitudeControlPoint: pinSize / 4,
          startPoint: {
            x: pieceSize / 2 - pinSize / 2,
            y: pinSize,
          },
        },
      });

    path +=
      ' ' +
      createPinSidePath({
        pinType: 'outside',
        sideType: 'end',
        pieceSize,
        pinSize,
        config: {
          startControlPointAngleRange: [(1 / 3) * Math.PI, -(1 / 3) * Math.PI],
          endControlPointAngleRange: [(7 / 12) * Math.PI, (5 / 4) * Math.PI],
          maxMagnitudeControlPoint: pinSize / 4,
          startPoint: {
            x: pieceSize + pinSize,
            y: pinSize,
          },
        },
      });

    path +=
      ' ' +
      createFlatBodyPath({
        pinType: 'outside',
        pieceSize,
        pinSize,
        config: {
          startControlPointAngleRange: [(1 / 3) * Math.PI, -(1 / 3) * Math.PI],
          endControlPointAngleRange: [(2 / 3) * Math.PI, (4 / 3) * Math.PI],
          maxMagnitudeControlPoint: pieceSize / 5,
          startPoint: {
            x: pieceSize + pinSize,
            y: 0,
          },
        },
      });
  }

  return path;
}

export function createCurve(
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

// To have a smooth transition, the control point on the previous curve must be parallel to the current curve, but opposite. In other words the vector can be any magnitude but opposite direction.
export function calculateOppositeControlPoint(
  previousControlPoint: Coordinate,
  previousEndPoint: Coordinate
): Coordinate {
  const vector = {
    x: previousControlPoint.x - previousEndPoint.x,
    y: previousControlPoint.y - previousEndPoint.y,
  };

  const vectorMagnitude = Math.sqrt(
    Math.pow(vector.x, 2) + Math.pow(vector.y, 2)
  );

  const unitVector = {
    x: vector.x / vectorMagnitude,
    y: vector.y / vectorMagnitude,
  };

  const rand = Math.random() + 3;

  const newVector = {
    x: unitVector.x * rand,
    y: unitVector.y * rand,
  };

  console.log({
    previousControlPoint,
    previousEndPoint,
    newControlPoint: newVector,
  });

  return newVector;
}

interface CreateFlatBodyPathProps {
  pinType: PinType;
  pinSize: number;
  pieceSize: number;
  config: {
    startControlPointAngleRange: [number, number];
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

  const controlPointStartMagnitud = Math.random() * maxMagnitudeControlPoint;
  const controlPointEndMagnitud = Math.random() * maxMagnitudeControlPoint;

  const alpha =
    (Math.random() *
      (startControlPointAngleRange[0] - startControlPointAngleRange[1]) +
      startControlPointAngleRange[1]) %
    (2 * Math.PI);
  const beta =
    (Math.random() *
      (endControlPointAngleRange[1] - endControlPointAngleRange[0]) +
      endControlPointAngleRange[0]) %
    (2 * Math.PI);

  const controlPointStart = {
    x: startPoint.x + controlPointStartMagnitud * Math.cos(alpha),
    y: startPoint.y - controlPointStartMagnitud * Math.sin(alpha), // y is inverted in paths: y positive below
  };

  const controlPointEnd = {
    x: endPoint.x + controlPointEndMagnitud * Math.cos(beta),
    y: endPoint.y - controlPointEndMagnitud * Math.sin(beta), // y is inverted in paths: y positive below
  };

  const path = createCurve(
    controlPointStart.x,
    controlPointStart.y,
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
    startControlPointAngleRange: [number, number];
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

  const controlPointStartMagnitud = Math.random() * maxMagnitudeControlPoint;
  const controlPointEndMagnitud = Math.random() * maxMagnitudeControlPoint;

  const alpha =
    (Math.random() *
      (startControlPointAngleRange[0] - startControlPointAngleRange[1]) +
      startControlPointAngleRange[1]) %
    (2 * Math.PI);
  const beta =
    (Math.random() *
      (endControlPointAngleRange[1] - endControlPointAngleRange[0]) +
      endControlPointAngleRange[0]) %
    (2 * Math.PI);

  console.log({ alpha, beta });

  const controlPointStart = {
    x: startPoint.x + controlPointStartMagnitud * Math.cos(alpha),
    y: startPoint.y - controlPointStartMagnitud * Math.sin(alpha), // y is inverted in paths: y positive below
  };

  const controlPointEnd = {
    x: endPoint.x + controlPointEndMagnitud * Math.cos(beta),
    y: endPoint.y - controlPointEndMagnitud * Math.sin(beta), // y is inverted in paths: y positive below
  };

  console.log({ controlPointStart, controlPointEnd });

  const path = createCurve(
    controlPointStart.x,
    controlPointStart.y,
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
    startControlPointAngleRange: [number, number];
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

  const controlPointStartMagnitud = Math.random() * maxMagnitudeControlPoint;
  const controlPointEndMagnitud = Math.random() * maxMagnitudeControlPoint;

  const alpha =
    (Math.random() *
      (startControlPointAngleRange[0] - startControlPointAngleRange[1]) +
      startControlPointAngleRange[1]) %
    (2 * Math.PI);
  const beta =
    (Math.random() *
      (endControlPointAngleRange[1] - endControlPointAngleRange[0]) +
      endControlPointAngleRange[0]) %
    (2 * Math.PI);

  console.log({ alpha, beta });

  const controlPointStart = {
    x: startPoint.x + controlPointStartMagnitud * Math.cos(alpha),
    y: startPoint.y - controlPointStartMagnitud * Math.sin(alpha), // y is inverted in paths: y positive below
  };

  const controlPointEnd = {
    x: endPoint.x + controlPointEndMagnitud * Math.cos(beta),
    y: endPoint.y - controlPointEndMagnitud * Math.sin(beta), // y is inverted in paths: y positive below
  };

  console.log({ controlPointStart, controlPointEnd });

  const path = createCurve(
    controlPointStart.x,
    controlPointStart.y,
    controlPointEnd.x,
    controlPointEnd.y,
    endPoint.x,
    endPoint.y
  );

  return { path, endPoint, controlPointEnd };
}
