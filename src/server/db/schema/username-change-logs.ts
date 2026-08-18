import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const usernameChangeLogs = pgTable('username_change_logs', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  oldUsername: text('old_username').notNull(),

  newUsername: text('new_username').notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
});