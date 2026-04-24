import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Copy, Moon, RefreshCcw, Send, Sun } from "lucide-react";
import ResultCard from "../components/ResultCard";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const EXAMPLE_INPUT = ["A->B", "A->C", "B->D", "X->Y", "Y->Z", "Z->X", "A->B", "B->D", "A->A", "hello"];

const parseInput = (value) =>
  value
    .split(/\n|,/g)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

const HomePage = () => {
  const [isDark, setIsDark] = useState(false);
  const [input, setInput] = useState(EXAMPLE_INPUT.slice(0, 3).join("\n"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDark]);

  const handleSubmit = async () => {
    const data = parseInput(input);
    if (data.length === 0) {
      toast.error("Please enter at least one relationship");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/bfhl`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const payload = await response.json();
      setResult(payload);
      toast.success("Hierarchy processed successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error occurred";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const copyJson = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    toast.success("JSON copied to clipboard");
  };

  const onExample = () => {
    setInput(EXAMPLE_INPUT.join("\n"));
    toast.success("Example input inserted");
  };

  const onReset = () => {
    setInput("");
    setResult(null);
    setError("");
    toast.success("Form reset");
  };

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <section className="glass-card animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">SRM Full Stack Engineering Challenge</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Enter relationships like <span className="font-semibold">A-&gt;B</span> in new lines or comma separated format.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsDark((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-400/40 px-4 py-2 text-sm hover:bg-slate-200/60 dark:hover:bg-slate-800/60"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {isDark ? "Light" : "Dark"} Mode
          </button>
        </div>
      </section>

      <section className="glass-card animate-fade-in space-y-4">
        <label htmlFor="hierarchy-input" className="text-sm font-medium">
          Relationships Input
        </label>
        <textarea
          id="hierarchy-input"
          className="min-h-52 w-full rounded-xl border border-slate-400/30 bg-white/60 p-4 font-mono text-sm outline-none ring-indigo-500 transition focus:ring-2 dark:bg-slate-900/70"
          placeholder={"A->B\nA->C\nB->D"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <p className="text-xs text-slate-500">Helper: use single uppercase nodes only (A-Z), format must be X-&gt;Y.</p>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Send size={16} />
            {loading ? "Processing..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={onExample}
            className="rounded-xl border border-slate-400/40 px-4 py-2 text-sm hover:bg-slate-200/60 dark:hover:bg-slate-800/60"
          >
            Autofill Example
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-400/40 px-4 py-2 text-sm hover:bg-slate-200/60 dark:hover:bg-slate-800/60"
          >
            <RefreshCcw size={16} />
            Reset
          </button>
          <button
            type="button"
            onClick={copyJson}
            disabled={!result}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-400/40 px-4 py-2 text-sm hover:bg-slate-200/60 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-slate-800/60"
          >
            <Copy size={16} />
            Copy JSON
          </button>
        </div>

        {error && <p className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-700 dark:text-rose-300">{error}</p>}
      </section>

      {result && <ResultCard result={result} />}
    </main>
  );
};

export default HomePage;
