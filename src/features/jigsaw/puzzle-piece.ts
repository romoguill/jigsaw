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
    public groupId: string = this.id
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

  onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    this.setActive(true);
    // this.offset.x = e.clientX - this.x;
    // this.offset.y = e.clientY - this.y;
  }

  onMouseUp() {
    this.setActive(false);
    // this.offset.x = 0;
    // this.offset.y = 0;
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
  distanceToShape(side: ShapeSide, shape: PuzzlePiece): number {
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

  // // When shapes are draged near their corresponding neighbour they should stick together.
  // // This will only return to what size could be stiched based on proximity
  // canStitch(shape: PuzzlePiece, threshold = 8): ShapeSide | null {
  //   return (
  //     shapeSides.find(
  //       (side) => this.distanceToShape(side, shape) <= threshold
  //     ) ?? null
  //   );
  // }

  // // Verify if the shapes are placed according to the valid image.
  // shouldStitch(side: ShapeSide, shape: PuzzlePiece): boolean {
  //   switch (side) {
  //     case "top":
  //       return this.neighbourTop ? this.neighbourTop === shape : false;
  //     case "right":
  //       return this.neighbourRight ? this.neighbourRight === shape : false;
  //     case "bottom":
  //       return this.neighbourBottom ? this.neighbourBottom === shape : false;
  //     case "left":
  //       return this.neighbourLeft ? this.neighbourLeft === shape : false;
  //   }
  // }

  // // Stich them both ways
  // stitchTo(shape: PuzzlePiece): void {
  //   // Once they are stitched, no need to snap anything
  //   if (this.stitchedTo.has(shape)) return;

  //   // TODO: Look for a better algorithm. Each shape in the same group will have a copy of every shap in group
  //   this.stitchedTo.add(shape);
  //   shape.stitchedTo.forEach((shape) => this.stitchedTo.add(shape));
  //   shape.stitchedTo.add(this);
  //   this.stitchedTo.forEach((shape) => shape.stitchedTo.add(this));

  //   // Snap active shape
  //   if (this.neighbourTop === shape) {
  //     this.x = shape.x;
  //     this.y = shape.y + this.height;
  //     // this.move({
  //     //   x: shape.x,
  //     //   y: shape.y + this.height,
  //     // });
  //   } else if (this.neighbourRight === shape) {
  //     this.x = shape.x - this.width;
  //     this.y = shape.y;
  //     // this.move({
  //     //   x: shape.x - this.width,
  //     //   y: shape.y,
  //     // });
  //   } else if (this.neighbourBottom === shape) {
  //     this.x = shape.x;
  //     this.y = shape.y - this.height;
  //     // this.move({
  //     //   x: shape.x,
  //     //   y: shape.y - this.height,
  //     // });
  //   } else {
  //     this.x = shape.x + this.width;
  //     this.y = shape.y;
  //     // this.move({
  //     //   x: shape.x + this.width,
  //     //   y: shape.y,
  //     // });
  //   }
  // }
}
