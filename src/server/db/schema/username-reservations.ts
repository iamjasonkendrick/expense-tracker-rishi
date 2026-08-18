import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const usernameReservations = pgTable("username_reservations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  username: text("username").notNull().unique(),

  reservedUntil: timestamp("reserved_until").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});
