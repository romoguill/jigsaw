export class Shape {
  width = 100;
  height = 100;
  id = crypto.randomUUID();

  constructor(
    public x: number,
    public y: number
  ) {}

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
