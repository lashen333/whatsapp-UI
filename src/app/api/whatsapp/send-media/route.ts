import { NextRequest, NextResponse } from "next/server";
import { detectMediaType } from "@/lib/whatsapp/detect-media-type";
import { sendMediaMessage } from "@/lib/whatsapp/send-media-message";
import { uploadMediaToWhatsApp } from "@/lib/whatsapp/upload-media";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const conversationId = formData.get("conversationId");
    const to = formData.get("to");
    const caption = formData.get("caption");
    const file = formData.get("file");

    if (typeof to !== "string" || !to.trim()) {
      return NextResponse.json(
        { success: false, error: "Missing 'to'" },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Missing file" },
        { status: 400 }
      );
    }

    const type = detectMediaType(file);
    const uploadResult = await uploadMediaToWhatsApp(file);

    const mediaId =
      typeof uploadResult.id === "string" ? uploadResult.id : null;

    if (!mediaId) {
      return NextResponse.json(
        { success: false, error: "Media upload did not return an id" },
        { status: 500 }
      );
    }

    const sendResult = await sendMediaMessage({
      to: to.trim(),
      mediaId,
      type,
      caption: typeof caption === "string" ? caption : undefined,
      fileName: file.name,
    });

    return NextResponse.json({
      success: true,
      conversationId:
        typeof conversationId === "string" ? conversationId : null,
      mediaId,
      response: sendResult.responsePayload,
    });
  } catch (error) {
    console.error("Send media failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}