// src\components\inbox\raw-json-viewer.tsx
type RawJsonViewerProps = {
  data: unknown;
};

export function RawJsonViewer({ data }: RawJsonViewerProps) {
  return (
    <pre className="h-full overflow-auto rounded-xl border bg-slate-950 p-4 text-xs text-slate-100">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}