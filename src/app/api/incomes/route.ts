import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { incomes, incomeSources } from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";

// GET: Fetch all incomes
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userIncomes = await db
      .select()
      .from(incomes)
      .where(eq(incomes.ownerId, session.user.id))
      .orderBy(desc(incomes.createdAt));

    return NextResponse.json(userIncomes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch incomes" }, { status: 500 });
  }
}

// POST: Add a new income
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;
    const body = await request.json();
    const { amount, description } = body;

    // Smart Logic: Ensure the user has an income source (e.g., "Salary")
    let userSources = await db.select().from(incomeSources).where(eq(incomeSources.userId, userId));
    let sourceId = userSources[0]?.id;

    if (!sourceId) {
      const [newSource] = await db.insert(incomeSources).values({
        userId,
        name: "General Income",
        isSystem: true,
      }).returning();
      sourceId = newSource.id;
    }

    await db.insert(incomes).values({
      ownerId: userId,
      sourceId: sourceId,
      amount: amount.toString(),
      description,
      incomeDate: new Date().toISOString().split('T')[0],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add income" }, { status: 500 });
  }
}