import { pgTable, text, numeric, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { expenses } from './expenses';

export const expenseParticipants = pgTable('expense_participants', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  expenseId: text('expense_id')
    .notNull()
    .references(() => expenses.id, { onDelete: 'cascade' }),

  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  shareAmount: numeric('share_amount', { precision: 12, scale: 2 }).notNull(),

  role: text('role').notNull().default('participant'),

  permission: text('permission').notNull().default('view'),

  status: text('status').notNull().default('pending'),

  hiddenAt: timestamp('hidden_at'),

  createdAt: timestamp('created_at').notNull().defaultNow(),

  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});