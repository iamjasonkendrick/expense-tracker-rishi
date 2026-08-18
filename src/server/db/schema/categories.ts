import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const categories = pgTable("categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),

  name: text("name").notNull(),

  isSystem: boolean("is_system").notNull().default(false),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});
