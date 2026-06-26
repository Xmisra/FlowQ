const QueueCard = ({
  queue,
  onManage,
  onShowQR,
  onToggleQueue,
  onDelete
}) => {
  return (
    <article className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-soft transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold tracking-tight text-slate-950">{queue.name}</h3>
          <p className="mt-1 truncate text-sm font-medium text-slate-500">{queue.location}</p>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${queue.isActive ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-slate-50 text-slate-600 ring-slate-200"}`}>
          {queue.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="my-5 h-px bg-slate-100" />

      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onManage}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/15 transition duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            Manage Queue
          </button>

          <button
            type="button"
            onClick={onShowQR}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-slate-100"
          >
            Show QR
          </button>
        </div>

        <button
          type="button"
          onClick={onToggleQueue}
          className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 focus:outline-none focus:ring-4 ${queue.isActive
            ? "bg-red-600 shadow-red-600/15 hover:bg-red-700 focus:ring-red-100"
            : "bg-emerald-600 shadow-emerald-600/15 hover:bg-emerald-700 focus:ring-emerald-100"
            }`}
        >
          {queue.isActive ? "Close Queue" : "Open Queue"}
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="w-full rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition duration-200 hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100"
        >
          Delete Queue
        </button>
      </div>
    </article>
  );
};

export default QueueCard;
