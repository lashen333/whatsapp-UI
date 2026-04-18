// src\app\api\whatsapp\conversations\[conversationId]\route.ts
import { NextRequest, NextResponse } from "next/server";
import { getConversationMessages } from "@/lib/inbox/get-conversation-messages";

type RouteContext = {
  params: Promise<{
    conversationId: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { conversationId } = await context.params;

    const messages = await getConversationMessages(conversationId);

    return NextResponse.json({
      success: true,
      conversationId,
      messages,
    });
  } catch (error) {
    console.error("Get conversation messages failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}