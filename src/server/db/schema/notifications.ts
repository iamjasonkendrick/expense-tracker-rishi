import { pgTable, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const notifications = pgTable('notifications', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  type: text('type').notNull(),

  title: text('title').notNull(),

  message: text('message').notNull(),

  data: text('data'),

  isRead: boolean('is_read').notNull().default(false),

  emailSentAt: timestamp('email_sent_at'),

  createdAt: timestamp('created_at').notNull().defaultNow(),
});