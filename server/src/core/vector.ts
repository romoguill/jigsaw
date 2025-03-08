import type { Coordinate } from '../../shared/types.js';

export class Vector {
  readonly x: number;
  readonly y: number;
  constructor(
    public end: Coordinate,
    public start: Coordinate = { x: 0, y: 0 }
  ) {
    this.x = end.x - start.x;
    this.y = end.y = start.y;
  }

  get magnitude(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  get angle(): number {
    return (Math.atan2(-this.y, this.x) + 2 * Math.PI) % (2 * Math.PI);
  }

  unit(): Vector {
    const magnitude = this.magnitude;

    return new Vector({ x: this.x / magnitude, y: this.y / magnitude });
  }
}
