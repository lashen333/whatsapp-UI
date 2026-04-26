// src\components\inbox\composer\composer-bar.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { AttachmentButton } from "@/components/inbox/composer/attachment-button";
import { AttachmentPreview } from "@/components/inbox/composer/attachment-preview";
import { EmojiButton } from "@/components/inbox/composer/emoji-button";

type ComposerBarProps = {
  disabled?: boolean;
  onSendText: (text: string) => Promise<void>;
  onSendMedia: (file: File, caption?: string) => Promise<void>;
};

export function ComposerBar({
  disabled = false,
  onSendText,
  onSendMedia,
}: ComposerBarProps) {
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const canSend = useMemo(() => {
    return !disabled && !isSending && (text.trim().length > 0 || !!selectedFile);
  }, [disabled, isSending, text, selectedFile]);

  async function handleSend() {
    if (!canSend) return;

    try {
      setIsSending(true);

      if (selectedFile) {
        await onSendMedia(selectedFile, text.trim() || undefined);
        setSelectedFile(null);
        setText("");
        return;
      }

      if (text.trim()) {
        await onSendText(text.trim());
        setText("");
      }
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="border-t bg-slate-50">
      <AttachmentPreview
        file={selectedFile}
        previewUrl={previewUrl}
        onRemove={() => setSelectedFile(null)}
      />

      <div className="px-4 py-3">
        <div className="flex items-end gap-3 rounded-2xl bg-white p-2 shadow-sm">
          <AttachmentButton onSelectFile={setSelectedFile} />
          <EmojiButton onSelectEmoji={(emoji) => setText((prev) => prev + emoji)} />

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={1}
            placeholder="Type a message"
            disabled={disabled || isSending}
            className="max-h-40 min-h-[44px] flex-1 resize-none rounded-xl px-3 py-2 text-sm text-black outline-none"
            onKeyDown={async (e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                await handleSend();
              }
            }}
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {isSending ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}