'use client';
export default function Pager({ page, pageSize, total, onChange }) {
  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));
  const goPrev = () => onChange(Math.max(1, page - 1));
  const goNext = () => onChange(Math.min(totalPages, page + 1));
  return (
    <div className="flex items-center justify-between pt-3">
      <span className="text-sm text-slate-600">
        Page {page} of {totalPages} — {total} total
      </span>
      <div className="flex gap-2">
        <button type="button" onClick={goPrev} disabled={page <= 1}
          className="px-3 py-1.5 rounded-lg bg-slate-100 disabled:opacity-50">Prev</button>
        <button type="button" onClick={goNext} disabled={page >= totalPages}
          className="px-3 py-1.5 rounded-lg bg-slate-100 disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}
