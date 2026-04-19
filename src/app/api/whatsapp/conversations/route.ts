import { NextRequest, NextResponse } from "next/server";
import { desc, ilike, or } from "drizzle-orm";
import { db } from "@/db";
import { waConversations } from "@/db/schema/wa-conversations";

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get("search")?.trim() || "";

    const conversations = await db.query.waConversations.findMany({
      where: search
        ? or(
            ilike(waConversations.customerName, `%${search}%`),
            ilike(waConversations.customerPhone, `%${search}%`),
            ilike(waConversations.latestMessagePreview, `%${search}%`)
          )
        : undefined,
      orderBy: [desc(waConversations.lastMessageAt)],
    });

    return NextResponse.json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Get conversations failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}