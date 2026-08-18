import { pgTable, text, numeric, date, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { categories } from './categories';

export const expenses = pgTable('expenses', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  ownerId: text('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  categoryId: text('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' }),

  totalAmount: numeric('total_amount', { precision: 12, scale: 2 }).notNull(),

  expenseDate: date('expense_date').notNull(),

  paymentMethod: text('payment_method').notNull().default('cash'),

  description: text('description'),

  currencyCode: text('currency_code').notNull().default('INR'),

  createdAt: timestamp('created_at').notNull().defaultNow(),

  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});