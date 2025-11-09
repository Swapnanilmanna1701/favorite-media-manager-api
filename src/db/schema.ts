import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const entry = sqliteTable('entry', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  type: text('type').notNull(),
  director: text('director').notNull(),
  budget: real('budget').notNull(),
  location: text('location').notNull(),
  duration: text('duration').notNull(),
  year: integer('year').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});