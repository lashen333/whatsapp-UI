type AttachmentPreviewProps = {
  file: File | null;
  previewUrl: string | null;
  onRemove: () => void;
};

export function AttachmentPreview({
  file,
  previewUrl,
  onRemove,
}: AttachmentPreviewProps) {
  if (!file) return null;

  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");

  return (
    <div className="border-t bg-slate-50 px-4 py-3">
      <div className="rounded-2xl border bg-white p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">
              {file.name}
            </p>
            <p className="text-xs text-slate-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="rounded-lg px-2 py-1 text-xs text-red-600 hover:bg-red-50"
          >
            Remove
          </button>
        </div>

        {isImage && previewUrl ? (
          <img
            src={previewUrl}
            alt={file.name}
            className="max-h-56 rounded-xl object-cover"
          />
        ) : null}

        {isVideo && previewUrl ? (
          <video controls className="max-h-56 rounded-xl">
            <source src={previewUrl} />
          </video>
        ) : null}

        {!isImage && !isVideo ? (
          <div className="rounded-xl bg-slate-100 p-3 text-sm text-slate-600">
            File ready to send
          </div>
        ) : null}
      </div>
    </div>
  );
}