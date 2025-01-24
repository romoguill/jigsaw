import { Coordinate, ShapeCorners, ShapeSide, shapeSides } from "../../types";

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
    public y: number,
    public img: string,
    public neighbourTop?: Shape | null,
    public neighbourRight?: Shape | null,
    public neighbourBottom?: Shape | null,
    public neighbourLeft?: Shape | null
  ) {}

  getCoordinates(): { [key in ShapeCorners]: Coordinate } {
    return {
      topLeft: {
        x: this.x,
        y: this.y,
      },
      topRight: {
        x: this.x + this.width,
        y: this.y,
      },
      bottomLeft: {
        x: this.x,
        y: this.y + this.height,
      },
      bottomRight: {
        x: this.x + this.width,
        y: this.y + this.height,
      },
    };
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.font = "50px Arial";
    ctx.fillStyle = "black";
    // For testing
    ctx.fillText(
      this.img,
      this.x + this.width / 2 - 10,
      this.y + this.height / 2 + 10
    );
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

  // Distance from the side of the shape to onother shape's opposite side
  distanceToShape(side: ShapeSide, shape: Shape): number {
    switch (side) {
      case "top":
        return (
          this.getCoordinates().topLeft.y - shape.getCoordinates().bottomLeft.y
        );
      case "bottom":
        return (
          this.getCoordinates().bottomLeft.y - shape.getCoordinates().topLeft.y
        );
      case "right":
        return (
          this.getCoordinates().topRight.x - shape.getCoordinates().topLeft.x
        );
      case "left":
        return (
          this.getCoordinates().topLeft.y - shape.getCoordinates().topRight.y
        );
    }
  }

  // When shapes are draged near their corresponding neighbour they should stick together
  canStitch(shape: Shape, threshold = 10): ShapeSide | null {
    return (
      shapeSides.find(
        (side) => this.distanceToShape(side, shape) <= threshold
      ) ?? null
    );
  }
}
