import { Coordinate, ShapeCorners, ShapeSide } from "../../types";

export class PuzzlePiece {
  width = 100;
  height = 100;
  image: HTMLImageElement | null = null;
  active = false;
  isImageLoaded = false;
  offsetFromGroupOrigin: Coordinate = {
    x: 0,
    y: 0,
  };
  scale = 1;
  zIndex: number;

  constructor(
    public id: number,
    public x: number,
    public y: number,
    public imgUrl: string,
    public pieceSize: number,
    public pieceFootprint: number,
    // neighbour -> e.g {top: shapeId-123}
    public neighbours: Record<ShapeSide, number | null> = {
      top: null,
      right: null,
      bottom: null,
      left: null,
    },
    public groupId: number = id,
    zIndex: number = 0
  ) {
    this.loadImage();
    this.scale = this.width / pieceSize;
    this.zIndex = zIndex;
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
    image.onload = () => {
      this.isImageLoaded = true;
    };

    this.image = image;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.image) {
      ctx.drawImage(
        this.image,
        this.x - (this.pieceSize * this.scale) / 4,
        this.y - (this.pieceSize * this.scale) / 4,
        this.pieceFootprint * this.scale,
        this.pieceFootprint * this.scale
      );
    }
  }

  // Move will be relative to the group origin
  move(origin: Coordinate): void {
    this.x = origin.x + this.offsetFromGroupOrigin.x;
    this.y = origin.y + this.offsetFromGroupOrigin.y;
  }

  setActive(state: boolean) {
    this.active = state;
    console.log(this.zIndex);
    console.log("hola");
    console.log("setActive", state);
    if (state) {
      // When piece becomes active, bring it to the front
      this.zIndex = 1;
    } else {
      this.zIndex = 0;
    }
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
