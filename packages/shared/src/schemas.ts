// shared/src/schemas.ts
import { z } from 'zod';

// ----- ENUMS -----
export const gameDifficulty = ['easy', 'medium', 'hard'] as const;
export type GameDifficulty = (typeof gameDifficulty)[number];

export const coordinateSchema = z.object({ x: z.number(), y: z.number() });
export type Coordinate = z.infer<typeof coordinateSchema>;

export const shapeSides = ['top', 'right', 'bottom', 'left'] as const;
export type ShapeSide = (typeof shapeSides)[number];
export type ShapeCorners =
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight';

export const theme = ['dark', 'light', 'system'] as const;
export type Theme = typeof theme;

export const role = ['admin', 'user', 'visitor'] as const;
export type Role = typeof role;

export const pieceCount = ['12', '50', '100', '200', '500', '1000'] as const;
export type PieceCount = typeof pieceCount;

// ----- GAME RELATED SCHEMAS -----
type PiecesData = { id: string; image: string }[][];

export type GameData = { piecesData: PiecesData; pieceSize: number };

// ----- ENTITY SCHEMAS -----
export const gameSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  imageKey: z.string(),
  difficulty: z.enum(gameDifficulty),
  pieceCount: z.number(),
  hasBorders: z.boolean().default(true),
  horizontalPaths: z.array(z.string()),
  verticalPaths: z.array(z.string()),
  pieceSize: z.number().min(0),
  pieceFootprint: z.number().min(0),
  columns: z.number().min(0),
  rows: z.number().min(0),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Game = z.infer<typeof gameSchema>;

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  image: z.string().optional(),
  role: z.enum(role),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof userSchema>;

// ----- FORM RELATED SCHEMAS -----
export const jigsawBuilderFormSchema = z.object({
  difficulty: z.enum(gameDifficulty),
  pieceCount: z.enum(pieceCount),
  borders: z.boolean(),
});

export type JigsawBuilderFormValues = z.infer<typeof jigsawBuilderFormSchema>;

export const pathsSchema = z.object({
  horizontal: z.string().array(),
  vertical: z.string().array(),
});

export type Paths = z.infer<typeof pathsSchema>;
