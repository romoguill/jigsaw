import { Curve } from '../curve.js';
import type { Coordinate } from '@jigsaw/shared';

describe('Curve', () => {
  // Sample coordinates for testing
  const start: Coordinate = { x: 0, y: 0 };
  const end: Coordinate = { x: 10, y: 10 };
  const controlStart: Coordinate = { x: 5, y: 0 };
  const controlEnd: Coordinate = { x: 0, y: 5 };

  describe('constructor', () => {
    it('should initialize with provided points', () => {
      const curve = new Curve({ start, end, controlStart, controlEnd });

      expect(curve.startPoint).toEqual(start);
      expect(curve.endPoint).toEqual(end);
      expect(curve.controlStartPoint).toEqual(controlStart);
      expect(curve.controlEndPoint).toEqual(controlEnd);
    });
  });

  describe('getPoints', () => {
    it('should return all curve points', () => {
      const curve = new Curve({ start, end, controlStart, controlEnd });
      const points = curve.getPoints();

      expect(points).toEqual({
        start,
        end,
        controlStart,
        controlEnd,
      });
    });
  });

  describe('reverse', () => {
    it('should swap start and end points', () => {
      const curve = new Curve({ start, end, controlStart, controlEnd });

      curve.reverse(0);

      expect(curve.startPoint).toEqual(end);
      expect(curve.endPoint).toEqual(start);
    });

    it('should swap and rotate control points', () => {
      const curve = new Curve({ start, end, controlStart, controlEnd });
      curve.reverse(1);

      expect(curve.controlStartPoint).toEqual({ x: 20, y: 15 });
      expect(curve.controlEndPoint).toEqual({ x: -5, y: 0 });
    });

    it('should swap but not rotate control points in the edges', () => {
      const curve = new Curve({ start, end, controlStart, controlEnd });
      curve.reverse(0);

      // Don't rotate
      expect(curve.controlStartPoint).toEqual(controlEnd);
      // Rotate
      expect(curve.controlEndPoint).toEqual({ x: -5, y: 0 });
    });
  });

  describe('translate', () => {
    it('should move all points by the specified amount', () => {
      const curve = new Curve({ start, end, controlStart, controlEnd });
      const dx = 5;
      const dy = 10;

      curve.translate(dx, dy);

      expect(curve.startPoint).toEqual({ x: start.x + dx, y: start.y + dy });
      expect(curve.endPoint).toEqual({ x: end.x + dx, y: end.y + dy });
      expect(curve.controlStartPoint).toEqual({
        x: controlStart.x + dx,
        y: controlStart.y + dy,
      });
      expect(curve.controlEndPoint).toEqual({
        x: controlEnd.x + dx,
        y: controlEnd.y + dy,
      });
    });
  });

  describe('rotate90Clockwise', () => {
    it('should rotate all points 90 degrees clockwise around the start point by default', () => {
      const curve = new Curve({ start, end, controlStart, controlEnd });

      curve.rotate90Clockwise();

      expect(curve.startPoint).toEqual({ x: 0, y: 0 }); // Start point remains unchanged
      expect(curve.endPoint).toEqual({ x: -10, y: 10 });
      expect(curve.controlStartPoint).toEqual({ x: 0, y: 5 });
      expect(curve.controlEndPoint).toEqual({ x: -5, y: 0 });
    });

    it('should rotate all points 90 degrees clockwise around the specified origin', () => {
      const curve = new Curve({ start, end, controlStart, controlEnd });
      const origin: Coordinate = { x: 5, y: 5 };

      curve.rotate90Clockwise(origin);

      expect(curve.startPoint).toEqual({ x: 10, y: 0 });
      expect(curve.endPoint).toEqual({ x: 0, y: 10 });
      expect(curve.controlStartPoint).toEqual({ x: 10, y: 5 });
      expect(curve.controlEndPoint).toEqual({ x: 5, y: 0 });
    });
  });

  describe('toSvgLonghand', () => {
    it('should return the SVG path command in longhand format', () => {
      const curve = new Curve({ start, end, controlStart, controlEnd });

      expect(curve.toSvgLonghand()).toBe('C 5 0 0 5 10 10');
    });
  });

  describe('toSvgShorthand', () => {
    it('should return the SVG path command in shorthand format', () => {
      const curve = new Curve({ start, end, controlStart, controlEnd });

      expect(curve.toSvgShorthand()).toBe('S 0 5 10 10');
    });
  });
});
