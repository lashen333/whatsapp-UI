type MessageMediaProps = {
  messageType: string | null;
  mediaUrl?: string | null;
  fileName?: string | null;
  mimeType?: string | null;
};

export function MessageMedia({
  messageType,
  mediaUrl,
  fileName,
  mimeType,
}: MessageMediaProps) {
  if (!messageType) return null;

  if (messageType === "image" && mediaUrl) {
    return (
      <img
        src={mediaUrl}
        alt={fileName || "Image"}
        className="max-h-72 w-auto rounded-xl object-cover"
      />
    );
  }

  if (messageType === "video" && mediaUrl) {
    return (
      <video controls className="max-h-72 w-full rounded-xl">
        <source src={mediaUrl} />
      </video>
    );
  }

  if (messageType === "audio" && mediaUrl) {
    return <audio controls className="w-full"><source src={mediaUrl} /></audio>;
  }

  if (
    messageType === "document" ||
    messageType === "image" ||
    messageType === "video" ||
    messageType === "audio"
  ) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
        <p className="font-medium">{fileName || "Media file"}</p>
        <p className="mt-1 text-xs text-slate-500">{mimeType || messageType}</p>
      </div>
    );
  }

  return null;
}
