import type { Coordinate } from '../../shared/types.js';

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
  const pinSize = pieceSize / 8;
  const moveToOrigin = `M ${origin.x} ${origin.y}`;

  let path = moveToOrigin;

  let endPointX = 0;
  let endPointY = 0;
  let endControlPointX = 0;
  let endControlPointY = 0;
  let opositeControlPoint: Coordinate;

  for (let i = 0; i <= pieceQuantity; i++) {
    let startControlPointX = endControlPointX;
    let startControlPointY = endControlPointY;

    endControlPointX = (Math.random() - 0.5) * pieceSize * 0.5 + pieceSize / 4;
    endControlPointY = (Math.random() - 0.5) * pieceSize * 0.5;

    endPointX += pieceSize / 2 - pinSize;
    endPointY += 0;

    path += ` ${createCurve(
      startControlPointX,
      startControlPointY,
      endControlPointX,
      endControlPointY,
      endPointX,
      endPointY
    )}`;

    opositeControlPoint = calculateOppositeControlPoint(
      { x: endControlPointX, y: endControlPointY },
      { x: endPointX, y: endPointY }
    );
    startControlPointX = opositeControlPoint.x;
    startControlPointY = opositeControlPoint.y;

    // Pin start
    endControlPointX = (Math.random() - 0.5) * pieceSize * 0.5;
    endControlPointY = (Math.random() - 0.5) * pieceSize * 0.5 + pieceSize / 6;

    endPointX += 0;
    endPointY += pinSize;

    path += ` ${createCurve(
      startControlPointX,
      startControlPointY,
      endControlPointX,
      endControlPointY,
      endPointX,
      endPointY
    )}`;

    startControlPointX = endControlPointX;
    startControlPointY = endControlPointY;

    // Pin Middle
    endControlPointX = (Math.random() - 0.5) * pieceSize * 0.5 + pieceSize / 8;
    endControlPointY = (Math.random() - 0.5) * pieceSize * 0.5;

    endPointX += pinSize;
    endPointY += 0;

    path += ` ${createCurve(
      startControlPointX,
      startControlPointY,
      endControlPointX,
      endControlPointY,
      endPointX,
      endPointY
    )}`;

    // Pin End
    endControlPointX = (Math.random() - 0.5) * pieceSize * 0.5 + pieceSize / 8;
    endControlPointY = (Math.random() - 0.5) * pieceSize * 0.5;

    endPointX += 0;
    endPointY += -pinSize;

    path += ` ${createCurve(
      startControlPointX,
      startControlPointY,
      endControlPointX,
      endControlPointY,
      endPointX,
      endPointY
    )}`;

    // Piece End
    endControlPointX = (Math.random() - 0.5) * pieceSize * 0.5 + pieceSize / 8;
    endControlPointY = (Math.random() - 0.5) * pieceSize * 0.5;

    endPointX += pieceSize;
    endPointY += 0;

    path += ` ${createCurve(
      startControlPointX,
      startControlPointY,
      endControlPointX,
      endControlPointY,
      endPointX,
      endPointY
    )}`;
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
  perviouseEndPoint: Coordinate
): Coordinate {
  const gradient = previousControlPoint.x / previousControlPoint.y;

  const x = Math.random() * (perviouseEndPoint.x - previousControlPoint.x);
  const y = gradient * x;

  return {
    x,
    y,
  };
}
