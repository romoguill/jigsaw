import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable, blob } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { difficulty } from '../../../shared/types.js';

export const games = sqliteTable('games', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  imageUrl: text('image_url').notNull(),
  difficulty: text('difficulty', { enum: difficulty }).notNull(),
  pieceCount: integer('piece_count').notNull(),
  hasBorders: integer('has_borders', { mode: 'boolean' })
    .default(true)
    .notNull(),
  horizontalPaths: blob('horizontal_paths').notNull(), // Stored as BLOB
  verticalPaths: blob('vertical_paths').notNull(), // Stored as BLOB
  pieceSize: integer('piece_size').notNull(),
  columns: integer('columns').notNull(),
  rows: integer('rows').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

// Schema for inserting a new game
export const insertGameSchema = createInsertSchema(games);

// Schema for selecting a game
export const selectGameSchema = createSelectSchema(games);

// Type for a new game
export type NewGame = z.infer<typeof insertGameSchema>;

// Type for a game from the database
export type Game = z.infer<typeof selectGameSchema>;
