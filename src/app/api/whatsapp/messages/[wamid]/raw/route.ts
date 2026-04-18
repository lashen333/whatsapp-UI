// src\app\api\whatsapp\messages\[wamid]\raw\route.ts
import { NextRequest, NextResponse } from "next/server";
import { getMessageRaw } from "@/lib/inbox/get-message-raw";

type RouteContext = {
  params: Promise<{
    wamid: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { wamid } = await context.params;

    const message = await getMessageRaw(wamid);

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      wamid,
      data: {
        messageJson: message.messageJson,
        statusJson: message.statusJson,
        fullEventJson: message.fullEventJson,
      },
    });
  } catch (error) {
    console.error("Get raw message failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}