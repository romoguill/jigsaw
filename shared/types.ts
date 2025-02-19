export type Role = 'admin' | 'user' | 'visitor';

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
