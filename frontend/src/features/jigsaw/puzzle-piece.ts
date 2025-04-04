import { Coordinate, ShapeCorners, ShapeSide } from "../../types";

export class PuzzlePiece {
  width = 100;
  height = 100;
  image: HTMLImageElement | null = null;
  active = false;
  offsetFromGroupOrigin: Coordinate = {
    x: 0,
    y: 0,
  };

  constructor(
    public id: string,
    public x: number,
    public y: number,
    public imgUrl: string,
    // neighbour -> e.g {top: shapeId-123}
    public neighbours: Record<ShapeSide, string | null> = {
      top: null,
      right: null,
      bottom: null,
      left: null,
    },
    public groupId: string = id
  ) {
    this.loadImage();
  }

  get position(): Coordinate {
    return {
      x: this.x,
      y: this.y,
    };
  }

  static oppositeSide(side: ShapeSide): ShapeSide {
    switch (side) {
      case "top":
        return "bottom";
      case "right":
        return "left";
      case "bottom":
        return "top";
      case "left":
        return "right";
    }
  }

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

  private loadImage() {
    const image = new Image();
    image.src = this.imgUrl;

    this.image = image;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    if (this.image) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#333";
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  // Move will be relative to the group origin
  move(origin: Coordinate): void {
    this.x = origin.x + this.offsetFromGroupOrigin.x;
    this.y = origin.y + this.offsetFromGroupOrigin.y;
  }

  setActive(state: boolean) {
    this.active = state;
  }

  // Is the coordinate inside the piece?
  isIntersecting(coordinate: Coordinate): boolean {
    return (
      coordinate.x >= this.x &&
      coordinate.x <= this.x + this.width &&
      coordinate.y >= this.y &&
      coordinate.y <= this.y + this.height
    );
  }

  // Get the relative coordinate delte between one side of the piece and the opposite side of another.
  relativeCoordinatesTo(side: ShapeSide, shape: PuzzlePiece): Coordinate {
    switch (side) {
      case "top":
        return {
          x: shape.position.x - this.position.x,
          y: shape.position.y + shape.height - this.position.y,
        };
      case "bottom":
        return {
          x: shape.position.x - this.position.x,
          y: shape.position.y - this.position.y - this.height,
        };
      case "right":
        return {
          x: shape.position.x - this.position.x - this.width,
          y: shape.position.y - this.position.y,
        };
      case "left":
        return {
          x: shape.position.x + shape.width - this.position.x,
          y: shape.position.y - this.position.y,
        };
    }
  }
}
