import type { Coordinate } from '@jigsaw/shared';
import { Vector } from './vector.js';

type CurvePoints = {
  start: Coordinate;
  end: Coordinate;
  controlStart: Coordinate;
  controlEnd: Coordinate;
};

export class Curve {
  protected start: Coordinate;
  protected end: Coordinate;
  protected controlStart: Coordinate;
  protected controlEnd: Coordinate;

  constructor({ start, end, controlStart, controlEnd }: CurvePoints) {
    this.start = { ...start };
    this.end = { ...end };
    this.controlStart = { ...controlStart };
    this.controlEnd = { ...controlEnd };
  }

  getPoints(): CurvePoints {
    return {
      start: this.start,
      end: this.end,
      controlStart: this.controlStart,
      controlEnd: this.controlEnd,
    };
  }

  // Reverses the curve by swapping the start and end points and control points.
  reverse(): void {
    // Points can be swapped, but control points cannot.
    [this.start, this.end] = [this.end, this.start];

    console.log(this.start, this.end);

    // To reverse the control points, we need to swap the start and end control points, but also rotate them 180 degrees.
    [this.controlStart, this.controlEnd] = [this.controlEnd, this.controlStart];

    const controlStartVector = new Vector(this.controlStart, this.start);
    const controlEndVector = new Vector(this.controlEnd, this.end);

    controlStartVector.rotateVector180().translateOrigin(this.start);
    controlEndVector.rotateVector180().translateOrigin(this.end);

    this.controlStart = controlStartVector.normalize().toCoordinate();
    this.controlEnd = controlEndVector.normalize().toCoordinate();
  }

  // Move the curve by x and y amount. Can set a
  translate(x: number, y: number) {
    this.start.x += x;
    this.start.y += y;
    this.end.x += x;
    this.end.y += y;
    this.controlStart.x += x;
    this.controlStart.y += y;
    this.controlEnd.x += x;
    this.controlEnd.y += y;
  }

  // Rotate the curve clockwise by a given angle. If no origin is provided, the rotation will be around the start point.
  rotate90Clockwise(origin: Coordinate = this.start) {
    const startVector = new Vector(this.start, origin);
    const endVector = new Vector(this.end, origin);
    const controlStartVector = new Vector(this.controlStart, origin);
    const controlEndVector = new Vector(this.controlEnd, origin);

    startVector.rotateVector90().translateOrigin(origin);
    endVector.rotateVector90().translateOrigin(origin);
    controlStartVector.rotateVector90().translateOrigin(origin);
    controlEndVector.rotateVector90().translateOrigin(origin);

    this.start = startVector.normalize().toCoordinate();
    this.end = endVector.normalize().toCoordinate();
    this.controlStart = controlStartVector.normalize().toCoordinate();
    this.controlEnd = controlEndVector.normalize().toCoordinate();
  }

  toSvgLonghand(): string {
    return `C ${this.controlStart.x} ${this.controlStart.y} ${this.controlEnd.x} ${this.controlEnd.y} ${this.end.x} ${this.end.y}`;
  }

  toSvgShorthand(): string {
    return `S ${this.controlEnd.x} ${this.controlEnd.y} ${this.end.x} ${this.end.y}`;
  }

  // Getters
  get startPoint(): Coordinate {
    return this.start;
  }

  get endPoint(): Coordinate {
    return this.end;
  }

  get controlStartPoint(): Coordinate {
    return this.controlStart;
  }

  get controlEndPoint(): Coordinate {
    return this.controlEnd;
  }
}
