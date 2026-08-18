import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const incomeSources = pgTable("income_sources", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),

  name: text("name").notNull(),

  sourceType: text("source_type").notNull().default("extra"),

  isSystem: boolean("is_system").notNull().default(false),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});
