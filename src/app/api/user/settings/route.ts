import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { userSettings } from "@/server/db/schema";
import { eq } from "drizzle-orm";

// GET: Fetch user settings
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, session.user.id))
      .limit(1);

    if (settings.length > 0) {
      return NextResponse.json(settings[0]);
    }

    // Return defaults if no settings exist yet
    return NextResponse.json({
      theme: "system",
      accentColor: "teal",
      language: "en",
      dateFormat: "dd/mm/yyyy",
      currency: "INR",
    });
  } catch (error) {
    console.error("GET settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// PATCH: Update user settings
export async function PATCH(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { theme, accentColor, language, dateFormat, currency } = body;

    // Validate theme value
    if (theme && !["light", "dark", "system"].includes(theme)) {
      return NextResponse.json({ error: "Invalid theme value" }, { status: 400 });
    }

    // Check if settings exist
    const existing = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, session.user.id))
      .limit(1);

    if (existing.length > 0) {
      // Update existing settings
      const updateData: Record<string, string> = { updatedAt: new Date().toISOString() };
      if (theme) updateData.theme = theme;
      if (accentColor) updateData.accentColor = accentColor;
      if (language) updateData.language = language;
      if (dateFormat) updateData.dateFormat = dateFormat;
      if (currency) updateData.currency = currency;

      await db
        .update(userSettings)
        .set(updateData)
        .where(eq(userSettings.userId, session.user.id));
    } else {
      // Create new settings
      await db.insert(userSettings).values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        theme: theme || "system",
        accentColor: accentColor || "teal",
        language: language || "en",
        dateFormat: dateFormat || "dd/mm/yyyy",
        currency: currency || "INR",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}