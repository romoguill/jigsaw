import { Coordinate } from "../../types";

export class Shape {
  width = 100;
  height = 100;
  id = crypto.randomUUID();
  active = false;
  offset = {
    x: 0,
    y: 0,
  };

  constructor(
    public x: number,
    public y: number
  ) {}

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move(coordinate: Coordinate) {
    this.x = coordinate.x;
    this.y = coordinate.y;
  }

  setActive(state: boolean) {
    this.active = state;
  }

  onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    this.setActive(true);
    this.offset.x = e.clientX - this.x;
    this.offset.y = e.clientY - this.y;
  }

  onMouseUp() {
    this.setActive(false);
    this.offset.x = 0;
    this.offset.y = 0;
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
