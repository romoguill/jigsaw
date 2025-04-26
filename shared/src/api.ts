import type { UploadThingRouter } from '@jigsaw/server/src/lib/uploadthing';
import type { Hono } from 'hono';
import type { Game } from './schemas.js';

export type UploadRouter = UploadThingRouter;

// Define the API response types
export type BuilderResponse = {
  data: Game;
};

// Define the route types that can be used by both client and server
export type GameRoutes = {
  builder: {
    path: {
      $post: {
        json: {
          origin: { x: number; y: number };
          pieceSize: number;
          cols: number;
          rows: number;
        };
        response: {
          success: boolean;
          data: {
            paths: {
              horizontal: string[];
              vertical: string[];
            };
            pieceFootprint: number;
          };
        };
      };
    };
    $post: {
      json: {
        difficulty: string;
        pieceCount: string;
        borders: boolean;
        imageKey: string;
        pieceSize: number;
        rows: number;
        columns: number;
        origin: { x: number; y: number };
        cached?: {
          horizontalPaths: string[];
          verticalPaths: string[];
          pieceFootprint: number;
        };
      };
      response: BuilderResponse;
    };
  };
};
