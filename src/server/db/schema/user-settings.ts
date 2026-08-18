import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const userSettings = pgTable('user_settings', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  themeMode: text('theme_mode').notNull().default('system'),

  accentColor: text('accent_color').notNull().default('#10b981'),

  headerColor: text('header_color').notNull().default('#0f172a'),

  footerColor: text('footer_color').notNull().default('#0f172a'),

  language: text('language').notNull().default('en'),

  currencyCode: text('currency_code').notNull().default('INR'),

  timezone: text('timezone').notNull().default('UTC'),

  createdAt: timestamp('created_at').notNull().defaultNow(),

  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});