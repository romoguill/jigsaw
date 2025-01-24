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
  stitchedTo = new Set<Shape>(); // Values should be unique

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
  // I guess for now, calculating using pythagoras is enought
  distanceToShape(side: ShapeSide, shape: Shape): number {
    switch (side) {
      case "top":
        return Math.sqrt(
          Math.pow(
            this.getCoordinates().topLeft.y -
              shape.getCoordinates().bottomLeft.y,
            2
          ) +
            Math.pow(
              this.getCoordinates().topLeft.x -
                shape.getCoordinates().bottomLeft.x,
              2
            )
        );
      case "bottom":
        return Math.sqrt(
          Math.pow(
            this.getCoordinates().bottomLeft.y -
              shape.getCoordinates().topLeft.y,
            2
          ) +
            Math.pow(
              this.getCoordinates().bottomLeft.x -
                shape.getCoordinates().topLeft.x,
              2
            )
        );
      case "right":
        return Math.sqrt(
          Math.pow(
            this.getCoordinates().topRight.y - shape.getCoordinates().topLeft.y,
            2
          ) +
            Math.pow(
              this.getCoordinates().topRight.x -
                shape.getCoordinates().topLeft.x,
              2
            )
        );
      case "left":
        return Math.sqrt(
          Math.pow(
            this.getCoordinates().topLeft.y - shape.getCoordinates().topRight.y,
            2
          ) +
            Math.pow(
              this.getCoordinates().topLeft.x -
                shape.getCoordinates().topRight.x,
              2
            )
        );
    }
  }

  // When shapes are draged near their corresponding neighbour they should stick together.
  // This will only return to what size could be stiched based on proximity
  canStitch(shape: Shape, threshold = 8): ShapeSide | null {
    return (
      shapeSides.find(
        (side) => this.distanceToShape(side, shape) <= threshold
      ) ?? null
    );
  }

  // Verify if the shapes are placed according to the valid image.
  shouldStitch(side: ShapeSide, shape: Shape): boolean {
    switch (side) {
      case "top":
        return this.neighbourTop ? this.neighbourTop === shape : false;
      case "right":
        return this.neighbourRight ? this.neighbourRight === shape : false;
      case "bottom":
        return this.neighbourBottom ? this.neighbourBottom === shape : false;
      case "left":
        return this.neighbourLeft ? this.neighbourLeft === shape : false;
    }
  }

  // Stich them both ways
  stitchTo(shape: Shape): void {
    this.stitchedTo.add(shape);
    shape.stitchedTo.add(this);

    // Snap active shape
    if (this.neighbourTop === shape) {
      this.move({
        x: shape.x,
        y: shape.y + this.height,
      });
    } else if (this.neighbourRight === shape) {
      this.move({
        x: shape.x - this.width,
        y: shape.y,
      });
    } else if (this.neighbourBottom === shape) {
      this.move({
        x: shape.x,
        y: shape.y + this.height,
      });
    } else {
      this.move({
        x: shape.x + this.width,
        y: shape.y,
      });
    }
  }
}
