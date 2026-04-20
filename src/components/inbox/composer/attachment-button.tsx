"use client";

import { useRef } from "react";

type AttachmentButtonProps = {
  onSelectFile: (file: File) => void;
};

export function AttachmentButton({ onSelectFile }: AttachmentButtonProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="rounded-full p-2 text-slate-600 hover:bg-slate-100"
        aria-label="Attach file"
      >
        +
      </button>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onSelectFile(file);
          }

          e.currentTarget.value = "";
        }}
      />
    </>
  );
}