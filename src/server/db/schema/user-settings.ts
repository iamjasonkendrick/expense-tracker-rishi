import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const userSettings = pgTable("user_settings", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Theme preference: "light" | "dark" | "system"
  theme: varchar("theme", { length: 10 }).notNull().default("system"),
  
  // Accent color preference (for Priority 2.2 later)
  accentColor: varchar("accent_color", { length: 20 }).default("teal"),
  
  // Language preference
  language: varchar("language", { length: 5 }).default("en"),
  
  // Date format preference
  dateFormat: varchar("date_format", { length: 20 }).default("dd/mm/yyyy"),
  
  // Currency (we can migrate localStorage currency here later)
  currency: varchar("currency", { length: 5 }).default("INR"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});