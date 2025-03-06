type CreatePathProps = {
  origin: {
    x: number;
    y: number;
  };
  pieceSize: number;
  detail: number;
};

export function createPath({
  origin,
  pieceSize,
  detail = 1,
}: CreatePathProps): string {
  // Detail will determine the amount of curves the shape will have. For now I am thinking 2 for the corners, 2 for the pin sides and 1 for the pin top. That 5 curves. Curves = detail * 5.
  if (detail < 1) {
    throw new Error('Minimum detail must be 1');
  }
  const moveToOrigin = `M ${origin.x} ${origin.y}`;

  return 'M 0 0 C 1 0 2.185 -0.58 3 -1 C 3.932 -1.573 5 0 5.938 -0.343 C 7 -1 6 -2 6.564 -2.78 C 6.6667 -3 7.728 -2.975 7.664 -2.176 C 7.556 -1.314 7.254 -0.429 8 0 C 8.893 0.477 10.23 0.434 11.158 -0.041 C 12.086 -0.667 13.0097 0.13 14 0';
}
