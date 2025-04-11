import { Vector } from '../vector.js';
import type { Coordinate } from '@jigsaw/shared/index.js';

describe('Vector', () => {
  describe('constructor', () => {
    it('should create a vector with default start point', () => {
      const end: Coordinate = { x: 3, y: 4 };
      const vector = new Vector(end);
      expect(vector.x).toBe(3);
      expect(vector.y).toBe(4);
    });

    it('should create a vector with custom start point', () => {
      const start: Coordinate = { x: 1, y: 1 };
      const end: Coordinate = { x: 3, y: 4 };
      const vector = new Vector(end, start);
      expect(vector.x).toBe(2);
      expect(vector.y).toBe(3);
    });
  });

  describe('magnitude', () => {
    it('should calculate magnitude correctly', () => {
      const vector = new Vector({ x: 3, y: 4 });
      expect(vector.magnitude).toBe(5);
    });

    it('should return 0 for zero vector', () => {
      const vector = new Vector({ x: 0, y: 0 });
      expect(vector.magnitude).toBe(0);
    });
  });

  describe('angle', () => {
    it('should calculate angle correctly for positive x and y', () => {
      const vector = new Vector({ x: 1, y: 1 });
      expect(vector.angle).toBeCloseTo(Math.PI / 4, 10);
    });

    it('should calculate angle correctly for negative x and y', () => {
      const vector = new Vector({ x: -1, y: -1 });
      expect(vector.angle).toBeCloseTo((5 * Math.PI) / 4, 10);
    });
  });

  describe('unit', () => {
    it('should return unit vector', () => {
      const vector = new Vector({ x: 3, y: 4 });
      const unit = vector.unit();
      expect(unit.x).toBeCloseTo(0.6, 10);
      expect(unit.y).toBeCloseTo(0.8, 10);
    });

    it('should handle zero vector', () => {
      const vector = new Vector({ x: 0, y: 0 });
      expect(() => vector.unit()).toThrow();
    });
  });

  describe('rotateVector90', () => {
    it('should rotate vector 90 degrees clockwise', () => {
      const vector = new Vector({ x: 1, y: 0 });
      vector.rotateVector90();
      expect(vector.x).toBe(0);
      expect(vector.y).toBe(1);
    });
  });

  describe('rotateVector180', () => {
    it('should rotate vector 180 degrees', () => {
      const vector = new Vector({ x: 1, y: 1 });
      vector.rotateVector180();
      expect(vector.x).toBe(-1);
      expect(vector.y).toBe(-1);
    });
  });

  describe('translateOrigin', () => {
    it('should translate vector by given origin', () => {
      const vector = new Vector({ x: 1, y: 1 });
      const origin: Coordinate = { x: 2, y: 2 };
      vector.translateOrigin(origin);
      expect(vector.x).toBe(3);
      expect(vector.y).toBe(3);
    });
  });

  describe('toCoordinate', () => {
    it('should convert vector to coordinate', () => {
      const vector = new Vector({ x: 3, y: 4 });
      const coord = vector.toCoordinate();
      expect(coord).toEqual({ x: 3, y: 4 });
    });
  });
});
