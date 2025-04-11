import type { Coordinate } from '@jigsaw/shared/index.js';

export class Vector {
  x: number;
  y: number;
  constructor(
    public end: Coordinate,
    public start: Coordinate = { x: 0, y: 0 }
  ) {
    this.x = end.x - start.x;
    this.y = end.y - start.y;
  }

  get magnitude(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  get angle(): number {
    return (Math.atan2(-this.y, this.x) + 2 * Math.PI) % (2 * Math.PI);
  }

  unit(): Vector {
    const magnitude = this.magnitude;

    if (magnitude === 0) {
      throw new Error('Magnitude cannot be 0');
    }

    return new Vector({ x: this.x / magnitude, y: this.y / magnitude });
  }

  rotateVector90(): Vector {
    const x = this.x;
    this.x = -this.y;
    this.y = x;

    return this;
  }

  rotateVector180(): Vector {
    this.x = -this.x;
    this.y = -this.y;

    return this;
  }

  translateOrigin(origin: Coordinate): Vector {
    this.x = this.x + origin.x;
    this.y = this.y + origin.y;

    return this;
  }

  toCoordinate(): Coordinate {
    return { x: this.x, y: this.y };
  }
}
