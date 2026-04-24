import TreeView from "./TreeView";

const ResultCard = ({ result }) => {
  return (
    <section className="glass-card animate-fade-in space-y-5">
      <div>
        <h2 className="text-xl font-semibold">Result</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Structured output from `POST /bfhl`</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl bg-indigo-500/10 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">User ID</p>
          <p className="mt-1 break-all font-semibold">{result.user_id}</p>
        </div>
        <div className="rounded-xl bg-indigo-500/10 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
          <p className="mt-1 break-all font-semibold">{result.email_id}</p>
        </div>
        <div className="rounded-xl bg-indigo-500/10 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">College Roll Number</p>
          <p className="mt-1 break-all font-semibold">{result.college_roll_number}</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl bg-emerald-500/10 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Total Trees</p>
          <p className="mt-1 text-2xl font-bold">{result.summary.total_trees}</p>
        </div>
        <div className="rounded-xl bg-rose-500/10 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Total Cycles</p>
          <p className="mt-1 text-2xl font-bold">{result.summary.total_cycles}</p>
        </div>
        <div className="rounded-xl bg-violet-500/10 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Largest Tree Root</p>
          <p className="mt-1 text-2xl font-bold">{result.summary.largest_tree_root || "-"}</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl bg-slate-200/60 p-3 dark:bg-slate-800/60">
          <p className="text-sm font-semibold">Invalid Entries</p>
          <p className="mt-2 text-sm">{result.invalid_entries.length > 0 ? result.invalid_entries.join(", ") : "None"}</p>
        </div>
        <div className="rounded-xl bg-slate-200/60 p-3 dark:bg-slate-800/60">
          <p className="text-sm font-semibold">Duplicate Edges</p>
          <p className="mt-2 text-sm">{result.duplicate_edges.length > 0 ? result.duplicate_edges.join(", ") : "None"}</p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Hierarchies</h3>
        <div className="space-y-3">
          {result.hierarchies.length > 0 ? (
            result.hierarchies.map((hierarchy, index) => (
              <div key={`${hierarchy.root}-${index}`} className="rounded-xl border border-slate-300/70 p-4 dark:border-slate-700">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-semibold">Root: {hierarchy.root}</p>
                  {!hierarchy.has_cycle && <p className="text-sm text-slate-500">Depth: {hierarchy.depth}</p>}
                </div>
                <TreeView hierarchy={hierarchy} />
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No valid hierarchies found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResultCard;
