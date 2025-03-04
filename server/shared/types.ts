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
