import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { incomeSources, incomes } from "@/server/db/schema";

// GET: Fetch all incomes for the user
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userIncomes = await db
      .select()
      .from(incomes)
      .where(eq(incomes.userId, session.user.id))
      .orderBy(desc(incomes.createdAt));

    return NextResponse.json(userIncomes);
  } catch (error) {
    console.error("GET incomes error:", error);
    return NextResponse.json({ error: "Failed to fetch incomes" }, { status: 500 });
  }
}

// POST: Add a new income
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { amount, description } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Step 1: Find or create a default income source
    const userSources = await db
      .select()
      .from(incomeSources)
      .where(eq(incomeSources.userId, userId));

    let sourceId = userSources[0]?.id;

    if (!sourceId) {
      const [newSource] = await db
        .insert(incomeSources)
        .values({
          userId: userId,
          name: "General Income",
        })
        .returning();
      sourceId = newSource.id;
    }

    // Step 2: Insert the income with the source ID
    await db.insert(incomes).values({
      userId: userId,
      incomeSourceId: sourceId,
      amount: amount.toString(),
      note: description || "Income",
      incomeDate: new Date().toISOString().split("T")[0],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST income error:", error);
    return NextResponse.json({ error: "Failed to add income" }, { status: 500 });
  }
}
