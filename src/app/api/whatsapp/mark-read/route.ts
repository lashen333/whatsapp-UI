// src\app\api\whatsapp\mark-read\route.ts
import { NextRequest, NextResponse } from "next/server";
import { markMessageAsRead } from "@/lib/whatsapp/mark-message-read";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const messageId =
      typeof body.messageId === "string" ? body.messageId.trim() : "";

    if (!messageId) {
      return NextResponse.json(
        { success: false, error: "Missing 'messageId'" },
        { status: 400 }
      );
    }

    const result = await markMessageAsRead(messageId);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Mark read failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}