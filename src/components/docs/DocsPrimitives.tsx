import { useState } from "react";

/* ---------- JSON syntax highlighting (tiny, zero-dep) ---------- */

export function JsonBlock({ code, className = "" }: { code: string; className?: string }) {
  const tokens = code.split(/("(?:\\.|[^"\\])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?)/g);
  return (
    <pre className={`code-panel p-4 ${className}`}>
      <code>
        {tokens.map((t, i) => {
          if (/^"(?:\\.|[^"\\])*"\s*:$/.test(t)) {
            return (
              <span key={i} className="text-code-key">
                {t}
              </span>
            );
          }
          if (/^"/.test(t)) {
            return (
              <span key={i} className="text-code-string">
                {t}
              </span>
            );
          }
          if (/^(-?\d|true|false|null)/.test(t)) {
            return (
              <span key={i} className="text-code-number">
                {t}
              </span>
            );
          }
          return <span key={i}>{t}</span>;
        })}
      </code>
    </pre>
  );
}

/* ---------- Method badge ---------- */

export function MethodBadge({ method }: { method: "GET" | "POST" }) {
  return (
    <span
      className={
        method === "GET"
          ? "method-badge bg-method-get-bg text-method-get"
          : "method-badge bg-method-post-bg text-method-post"
      }
    >
      {method}
    </span>
  );
}

/* ---------- Copy button ---------- */

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="rounded-sm border border-border bg-surface-raised px-2 py-1 font-mono text-[0.65rem] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
      aria-label="Copy to clipboard"
    >
      {copied ? "copied ✓" : "copy"}
    </button>
  );
}

/* ---------- Schema table ---------- */

export interface SchemaField {
  name: string;
  type: string;
  required?: boolean;
  description: string;
}

export function SchemaTable({ fields }: { fields: SchemaField[] }) {
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-raised text-[0.7rem] uppercase tracking-wider text-muted-foreground">
            <th className="px-4 py-2.5 font-medium">Field</th>
            <th className="px-4 py-2.5 font-medium">Type</th>
            <th className="px-4 py-2.5 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((f) => (
            <tr key={f.name} className="border-b border-border/50 last:border-0">
              <td className="px-4 py-2.5 font-mono text-[0.8rem] text-code-key">
                {f.name}
                {f.required && <span className="ml-1.5 text-[0.65rem] text-warning">required</span>}
              </td>
              <td className="px-4 py-2.5 font-mono text-[0.8rem] text-muted-foreground">{f.type}</td>
              <td className="px-4 py-2.5 text-[0.85rem] text-muted-foreground">{f.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Live "Try it" console ---------- */

export function TryIt({
  method,
  path,
  defaultBody,
}: {
  method: "GET" | "POST";
  path: string;
  defaultBody?: string;
}) {
  const [body, setBody] = useState(defaultBody ?? "");
  const [response, setResponse] = useState<{ status: number; ms: number; body: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    const start = performance.now();
    try {
      const res = await fetch(path, {
        method,
        ...(method === "POST"
          ? { headers: { "Content-Type": "application/json" }, body }
          : {}),
      });
      const ms = Math.round(performance.now() - start);
      const text = await res.text();
      let pretty = text;
      try {
        pretty = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        /* keep raw */
      }
      setResponse({ status: res.status, ms, body: pretty });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-md border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
          Try it live
        </span>
        <button
          onClick={send}
          disabled={loading}
          className="rounded-sm bg-primary px-3.5 py-1.5 font-mono text-[0.7rem] font-bold uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "sending…" : "send request →"}
        </button>
      </div>
      {method === "POST" && (
        <div className="border-b border-border p-4">
          <label className="mb-1.5 block font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
            Request body
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            spellCheck={false}
            className="w-full resize-y rounded-md border border-input bg-code-bg p-3 font-mono text-[0.8rem] leading-relaxed text-foreground outline-none transition-colors focus:border-ring"
          />
        </div>
      )}
      <div className="p-4">
        {!response && !error && (
          <p className="font-mono text-[0.75rem] text-muted-foreground">
            → Response will appear here
          </p>
        )}
        {error && <p className="font-mono text-[0.8rem] text-destructive">Error: {error}</p>}
        {response && (
          <div>
            <div className="mb-2 flex items-center gap-3 font-mono text-[0.7rem]">
              <span
                className={
                  response.status < 400
                    ? "rounded-sm bg-method-get-bg px-2 py-0.5 font-bold text-success"
                    : "rounded-sm bg-destructive/10 px-2 py-0.5 font-bold text-destructive"
                }
              >
                {response.status}
              </span>
              <span className="text-muted-foreground">{response.ms} ms</span>
            </div>
            <JsonBlock code={response.body} />
          </div>
        )}
      </div>
    </div>
  );
}
