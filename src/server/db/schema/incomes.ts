import { date, numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { incomeSources } from "./income-sources";
import { users } from "./users";

export const incomes = pgTable("incomes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  incomeSourceId: text("income_source_id")
    .notNull()
    .references(() => incomeSources.id, { onDelete: "cascade" }),

  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),

  incomeDate: date("income_date").notNull(),

  note: text("note"),

  currencyCode: text("currency_code").notNull().default("INR"),

  createdAt: timestamp("created_at").notNull().defaultNow(),

  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
