import type { Coordinate } from '@jigsaw/shared';

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
    this.start = start;
    this.end = end;
    this.controlStart = controlStart;
    this.controlEnd = controlEnd;
  }

  reverseCurve(): void {
    this.start = this.end;
    this.end = this.start;
    this.controlStart = this.controlEnd;
    this.controlEnd = this.controlStart;
  }

  getPoints(): CurvePoints {
    return {
      start: this.start,
      end: this.end,
      controlStart: this.controlStart,
      controlEnd: this.controlEnd,
    };
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
