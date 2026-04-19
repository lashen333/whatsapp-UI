type ReplyContextPreviewProps = {
  text: string;
};

export function ReplyContextPreview({ text }: ReplyContextPreviewProps) {
  return (
    <div className="mb-2 rounded-lg border-l-4 border-slate-400 bg-slate-100 px-3 py-2 text-xs text-slate-600">
      <p className="line-clamp-2">{text}</p>
    </div>
  );
}
