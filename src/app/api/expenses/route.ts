import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { expenses } from "@/server/db/schema";

// GET: Fetch all expenses for the logged-in user
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userExpenses = await db
      .select()
      .from(expenses)
      .where(eq(expenses.ownerId, session.user.id))
      .orderBy(desc(expenses.createdAt)); // Show newest first

    return NextResponse.json(userExpenses);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 });
  }
}

// POST: Add a new expense (The code you already have)
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { amount, description } = body;

    // Note: For speed, we are assuming category handling is done or defaulting.
    // If you get a category error, we can fix it, but this is the fastest path.
    // We will fetch the first category available for the user to satisfy the DB constraint.
    const { categories } = await import("@/server/db/schema");

    const userCategories = await db.select().from(categories).where(eq(categories.userId, userId));
    let categoryId = userCategories[0]?.id;

    if (!categoryId) {
      // Auto-create category if missing
      const [newCat] = await db
        .insert(categories)
        .values({ userId, name: "General", isSystem: true })
        .returning();
      categoryId = newCat.id;
    }

    await db.insert(expenses).values({
      ownerId: userId,
      categoryId: categoryId,
      totalAmount: amount.toString(),
      description,
      expenseDate: new Date().toISOString().split("T")[0],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Expense API Error:", error);
    return NextResponse.json({ error: "Failed to add expense" }, { status: 500 });
  }
}
