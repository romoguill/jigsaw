import type { Coordinate } from '../../shared/types.js';

type PinType = 'inside' | 'outside';

type CreatePathProps = {
  origin: {
    x: number;
    y: number;
  };
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
  const pinSize = pieceSize * 0.2;
  const moveToOrigin = `M ${origin.x} ${origin.y}`;

  let path = moveToOrigin;

  let endPointX = 0;
  let endPointY = 0;
  let endControlPointX = 0;
  let endControlPointY = 0;
  let opositeControlPoint: Coordinate;

  console.log({ endPointX });

  for (let i = 0; i < pieceQuantity; i++) {
    path +=
      ' ' +
      createFlatBodyPath({
        pinType: 'outside',
        pieceSize: 10,
        pinSize: 2,
        config: {
          startControlPointAngleRange: [(1 / 3) * Math.PI, -(1 / 3) * Math.PI],
          endControlPointAngleRange: [(2 / 3) * Math.PI, (4 / 3) * Math.PI],
          maxMagnitudeControlPoint: 2,
        },
      });
    // let startControlPointX = endControlPointX;
    // let startControlPointY = endControlPointY;

    // endPointX += pieceSize / 2 - pinSize / 2;
    // endPointY += 0;

    // endControlPointX = (Math.random() - 0.5) * endPointX;
    // endControlPointY = (Math.random() - 0.5) * endPointY;

    // path += ` ${createCurve(
    //   startControlPointX,
    //   startControlPointY,
    //   endControlPointX,
    //   endControlPointY,
    //   endPointX,
    //   endPointY
    // )}`;

    // opositeControlPoint = calculateOppositeControlPoint(
    //   { x: endControlPointX, y: endControlPointY },
    //   { x: endPointX, y: endPointY }
    // );
    // startControlPointX = opositeControlPoint.x;
    // startControlPointY = opositeControlPoint.y;

    // // Pin start
    // endPointX += 0;
    // endPointY += pinSize;

    // endControlPointX = (Math.random() - 0.5) * endPointX;
    // endControlPointY = (Math.random() - 0.5) * endPointY;

    // path += ` ${createCurve(
    //   startControlPointX,
    //   startControlPointY,
    //   endControlPointX,
    //   endControlPointY,
    //   endPointX,
    //   endPointY
    // )}`;

    // opositeControlPoint = calculateOppositeControlPoint(
    //   { x: endControlPointX, y: endControlPointY },
    //   { x: endPointX, y: endPointY }
    // );
    // startControlPointX = opositeControlPoint.x;
    // startControlPointY = opositeControlPoint.y;

    // // Pin Middle
    // endPointX += pinSize;
    // endPointY += 0;

    // endControlPointX = (Math.random() - 0.5) * endPointX;
    // endControlPointY = (Math.random() - 0.5) * endPointY;

    // path += ` ${createCurve(
    //   startControlPointX,
    //   startControlPointY,
    //   endControlPointX,
    //   endControlPointY,
    //   endPointX,
    //   endPointY
    // )}`;

    // opositeControlPoint = calculateOppositeControlPoint(
    //   { x: endControlPointX, y: endControlPointY },
    //   { x: endPointX, y: endPointY }
    // );
    // startControlPointX = opositeControlPoint.x;
    // startControlPointY = opositeControlPoint.y;

    // // Pin End
    // endPointX += 0;
    // endPointY += -pinSize;

    // endControlPointX = (Math.random() - 0.5) * endPointX;
    // endControlPointY = (Math.random() - 0.5) * endPointY;

    // path += ` ${createCurve(
    //   startControlPointX,
    //   startControlPointY,
    //   endControlPointX,
    //   endControlPointY,
    //   endPointX,
    //   endPointY
    // )}`;

    // opositeControlPoint = calculateOppositeControlPoint(
    //   { x: endControlPointX, y: endControlPointY },
    //   { x: endPointX, y: endPointY }
    // );
    // startControlPointX = opositeControlPoint.x;
    // startControlPointY = opositeControlPoint.y;

    // // Piece End
    // endPointX += pieceSize;
    // endPointY += 0;

    // endControlPointX = (Math.random() - 0.5) * endPointX;
    // endControlPointY = (Math.random() - 0.5) * endPointY;

    // path += ` ${createCurve(
    //   startControlPointX,
    //   startControlPointY,
    //   endControlPointX,
    //   endControlPointY,
    //   endPointX,
    //   endPointY
    // )}`;
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
  },
}: CreateFlatBodyPathProps) {
  // const maxF = (maxAngleControlPointStart + minAngleControlPointEnd) / Math.PI;

  const startPoint = {
    x: 0,
    y: 0,
  };

  const endPoint = { x: pieceSize / 2 - pinSize / 2, y: 0 };

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

  return path;
  // switch (pinType) {
  //   case 'outside':
  // }
}
