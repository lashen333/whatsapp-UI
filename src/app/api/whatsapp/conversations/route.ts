// src\app\api\whatsapp\conversations\route.ts
import { NextResponse } from "next/server";
import { getConversations } from "@/lib/inbox/get-conversations";

export async function GET() {
  try {
    const conversations = await getConversations();

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