// shared/src/schemas.ts
import { z } from 'zod';

// ----- ENUMS -----
export const gameDifficulty = ['easy', 'medium', 'hard'] as const;
export type GameDifficulty = (typeof gameDifficulty)[number];

// ----- GAME SCHEMAS -----
export const gameSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  imageKey: z.string(),
  difficulty: z.enum(gameDifficulty),
  pieceCount: z.number(),
  hasBorders: z.boolean().default(true),
  horizontalPaths: z.array(z.string()),
  verticalPaths: z.array(z.string()),
  pieceSize: z.number(),
  columns: z.number(),
  rows: z.number(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Game = z.infer<typeof gameSchema>;

// ----- USER SCHEMAS -----
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  image: z.string().optional(),
  role: z.string().default('user'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof userSchema>;
