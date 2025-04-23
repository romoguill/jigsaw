import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

// ----- ENUMS -----

const gameDifficulty = ['easy', 'medium', 'hard'] as const;
// ----- UTILITIES -----

export const timestamps = {
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
};

// ----- BETER AUTH SCHEMAS -----

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull(),
  image: text('image'),
  role: text('role').notNull().default('user'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', {
    mode: 'timestamp',
  }),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', {
    mode: 'timestamp',
  }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

// ---------- UPLOADS ----------

export const uploadedImage = sqliteTable('uploaded_image', {
  id: integer('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  imageKey: text('image_key').notNull(),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  ...timestamps,
});

// ---------- GAMES ----------
export const games = sqliteTable('games', {
  id: integer('id').primaryKey(),
  imageKey: text('image_key').notNull(),
  difficulty: text('difficulty', { enum: gameDifficulty }).notNull(),
  pieceCount: integer('piece_count').notNull(),
  hasBorders: integer('has_borders', { mode: 'boolean' })
    .default(true)
    .notNull(),
  horizontalPaths: text('horizontal_paths', { mode: 'json' })
    .$type<string[]>()
    .notNull(),
  verticalPaths: text('vertical_paths', { mode: 'json' })
    .$type<string[]>()
    .notNull(),
  pieceSize: integer('piece_size').notNull(),
  pieceFootprint: integer('piece_footprint').notNull(),
  columns: integer('columns').notNull(),
  rows: integer('rows').notNull(),
  ...timestamps,
});

// Schema for inserting a new game
export const insertGameSchema = createInsertSchema(games);

// Schema for selecting a game
export const selectGameSchema = createSelectSchema(games);

// Type for a new game
export type NewGame = z.infer<typeof insertGameSchema>;
// Type for a game from the database
export type Game = z.infer<typeof selectGameSchema>;
