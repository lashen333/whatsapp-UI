import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { waConversations } from "@/db/schema/wa-conversations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const conversationId =
      typeof body.conversationId === "string" ? body.conversationId : "";

    if (!conversationId) {
      return NextResponse.json(
        { success: false, error: "Missing conversationId" },
        { status: 400 }
      );
    }

    await db
      .update(waConversations)
      .set({
        unreadCount: 0,
        updatedAt: new Date(),
      })
      .where(eq(waConversations.conversationId, conversationId));

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Mark conversation read failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
