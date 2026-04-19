type ChatHeaderProps = {
  title: string;
  subtitle: string;
};

export function ChatHeader({ title, subtitle }: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-3 border-b bg-slate-50 px-4 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
        {title.charAt(0).toUpperCase()}
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-900">{title}</p>
        <p className="truncate text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}
