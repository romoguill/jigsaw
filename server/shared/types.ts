import { z } from 'zod';

export const coordinateSchema = z.object({ x: z.number(), y: z.number() });
export type Coordinate = z.infer<typeof coordinateSchema>;

export const shapeSides = ['top', 'right', 'bottom', 'left'] as const;
export type ShapeSide = (typeof shapeSides)[number];
export type ShapeCorners =
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight';

type PiecesData = { id: string; image: string }[][];

export type GameData = { piecesData: PiecesData; pieceSize: number };

export type Theme = 'dark' | 'light' | 'system';

export const role = ['admin', 'user', 'visitor'] as const;
export type Role = typeof role;

export const difficulty = ['easy', 'medium', 'hard', 'impossible'] as const;
export type Difficulty = typeof difficulty;

export const pieceCount = ['50', '100', '200', '500', '1000'] as const;
export type PieceCount = typeof pieceCount;

export type User = {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null | undefined | undefined;
  role: Role;
};

export const jigsawBuilderFormSchema = z.object({
  difficulty: z
    .enum(difficulty, { message: 'Invalid option' })
    .or(z.literal(''))
    .refine((val) => val.length > 0, 'Must select an option'),
  pieceCount: z
    .enum(pieceCount, { message: 'Invalid option' })
    .or(z.literal(''))
    .refine((val) => val.length > 0, 'Must select an option'),
  borders: z.boolean(),
});

export type JigsawBuilderFormValues = z.infer<typeof jigsawBuilderFormSchema>;
