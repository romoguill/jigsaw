import { Coordinate } from "../../types";

export class Shape {
  width = 100;
  height = 100;
  id = crypto.randomUUID();
  active = false;

  constructor(
    public x: number,
    public y: number
  ) {}

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move(coordinate: Coordinate) {
    // Move position
    this.x = coordinate.x;
    this.y = coordinate.y;
  }

  setActive(state: boolean) {
    this.active = state;
  }

  isIntersecting(coordinate: Coordinate): boolean {
    return (
      coordinate.x >= this.x &&
      coordinate.x <= this.x + this.width &&
      coordinate.y >= this.y &&
      coordinate.y <= this.y + this.height
    );
  }
}
