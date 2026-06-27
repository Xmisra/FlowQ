const StatsCard = ({ label, value, tone = "blue" }) => {
  const tones = {
    slate: {
      accent: "bg-slate-500",
      badge: "bg-slate-50 text-slate-700 ring-slate-200",
      glow: "shadow-slate-200/60",
    },
    blue: {
      accent: "bg-blue-500",
      badge: "bg-blue-50 text-blue-700 ring-blue-100",
      glow: "shadow-blue-100/80",
    },
    purple: {
      accent: "bg-violet-500",
      badge: "bg-violet-50 text-violet-700 ring-violet-100",
      glow: "shadow-violet-100/80",
    },
    green: {
      accent: "bg-emerald-500",
      badge: "bg-emerald-50 text-emerald-700 ring-emerald-100",
      glow: "shadow-emerald-100/80",
    },
    red: {
      accent: "bg-rose-500",
      badge: "bg-rose-50 text-rose-700 ring-rose-100",
      glow: "shadow-rose-100/80",
    },
  };
  const selectedTone = tones[tone] ?? tones.blue;

  return (
    <div className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg ${selectedTone.glow}`}>
      <div className={`absolute inset-x-0 top-0 h-1 ${selectedTone.accent}`} />
      <div className="flex items-center justify-between gap-3">
        <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${selectedTone.badge}`}>
          {label}
        </div>
        <div className={`h-2 w-2 rounded-full ${selectedTone.accent}`} />
      </div>
      <p className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">{value ?? 0}</p>
    </div>
  );
};

export default StatsCard;
