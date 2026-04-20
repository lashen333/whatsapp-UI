"use client";

import { useState } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

type EmojiButtonProps = {
  onSelectEmoji: (emoji: string) => void;
};

export function EmojiButton({ onSelectEmoji }: EmojiButtonProps) {
  const [open, setOpen] = useState(false);

  function handleEmojiClick(emojiData: EmojiClickData) {
    onSelectEmoji(emojiData.emoji);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full p-2 text-slate-600 hover:bg-slate-100"
        aria-label="Open emoji picker"
      >
        😊
      </button>

      {open ? (
        <div className="absolute bottom-12 left-0 z-50">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      ) : null}
    </div>
  );
}