import { createFileRoute } from "@tanstack/react-router";
import {
  CopyButton,
  JsonBlock,
  MethodBadge,
  SchemaTable,
  TryIt,
} from "@/components/docs/DocsPrimitives";

export const Route = createFileRoute("/")({
  component: DocsPage,
});

const NEGOTIATE_REQUEST = `{
  "agent_a": { "price": 100, "deadline": 7 },
  "agent_b": { "price": 130, "deadline": 10 }
}`;

const NEGOTIATE_RESPONSE = `{
  "price": 115.0,
  "deadline": 10,
  "rationale": "The middle-ground deal uses the average price to balance both sides and keeps the later deadline so the agreement preserves extra slack."
}`;

const CURL_EXAMPLE = `curl -X POST /api/public/negotiate \\
  -H "Content-Type: application/json" \\
  -d '{"agent_a": {"price": 100, "deadline": 7},
       "agent_b": {"price": 130, "deadline": 10}}'`;

const PYTHON_EXAMPLE = `import requests

payload = {
    "agent_a": {"price": 100, "deadline": 7},
    "agent_b": {"price": 130, "deadline": 10},
}
r = requests.post(f"{BASE_URL}/api/public/negotiate", json=payload)
print(r.json())`;

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mb-2 scroll-mt-24 text-xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}

function DocsPage() {
  const highlights = [
    { title: "Format", value: "JSON only", detail: "application/json in and out" },
    { title: "Auth", value: "None", detail: "Open endpoints, validate inputs" },
    { title: "Latency", value: "< 50 ms", detail: "Pure computation, no I/O" },
  ];

  const workflowCards = [
    {
      title: "Balanced by design",
      text: "The service averages price and preserves the later deadline to keep outcomes fair.",
    },
    {
      title: "Agent-ready",
      text: "The response is compact, structured, and easy to plug into downstream automation.",
    },
    {
      title: "Operationally simple",
      text: "No auth, no persistence, and low-latency responses make it easy to test and ship.",
    },
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary font-mono text-sm font-bold text-primary-foreground shadow-[0_10px_30px_-12px_rgba(110,231,183,0.8)]">
              ⇄
            </span>
            <span className="font-semibold tracking-tight">
              Deal Finder <span className="text-muted-foreground">API</span>
            </span>
          </a>
          <div className="flex items-center gap-4 font-mono text-[0.7rem]">
            <span className="rounded-full border border-border/70 bg-surface px-2.5 py-1 text-muted-foreground">
              v1.0
            </span>
            <span className="hidden items-center gap-1.5 text-success sm:flex">
              <span className="size-1.5 animate-pulse rounded-full bg-success" />
              live
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-5">
        <nav className="sticky top-[57px] hidden h-[calc(100vh-57px)] w-56 shrink-0 flex-col gap-1 overflow-y-auto py-10 lg:flex">
          <p className="mb-2 px-3 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
            Reference
          </p>
          {[
            ["#overview", "Overview"],
            ["#authentication", "Authentication"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {label}
            </a>
          ))}
          <p className="mb-2 mt-5 px-3 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
            Endpoints
          </p>
          <a
            href="#health"
            className="flex items-center justify-between rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            /health
            <span className="font-mono text-[0.6rem] font-bold text-method-get">GET</span>
          </a>
          <a
            href="#negotiate"
            className="flex items-center justify-between rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            /negotiate
            <span className="font-mono text-[0.6rem] font-bold text-method-post">POST</span>
          </a>
          <p className="mb-2 mt-5 px-3 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
            Guides
          </p>
          <a
            href="#examples"
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Code examples
          </a>
        </nav>

        <main id="top" className="min-w-0 flex-1 py-10">
          <section className="docs-grid-bg relative mb-12 overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-surface via-surface/85 to-background p-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.75)] sm:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-primary/12 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 size-48 rounded-full bg-sky-500/8 blur-3xl" />
            <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
              <div>
                <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-primary">
                  API Reference · v1.0
                </p>
                <h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                  Find the fair middle ground between two agents.
                </h1>
                <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">
                  Deal Finder turns competing offers into a balanced agreement with a concise
                  rationale. It is lightweight, transparent, and built for agent-to-agent negotiation.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href="#negotiate"
                    className="rounded-lg bg-primary px-4 py-2 font-mono text-[0.75rem] font-bold uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    POST /negotiate →
                  </a>
                  <a
                    href="#examples"
                    className="rounded-lg border border-border/70 px-4 py-2 font-mono text-[0.75rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                  >
                    Code examples
                  </a>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {['Fast response', 'Easy to test', 'JSON-first'].map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-border/70 bg-background/60 px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/70 p-5 shadow-inner shadow-black/20">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
                    Sample payload
                  </p>
                  <span className="rounded-full bg-primary/12 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-primary">
                    live preview
                  </span>
                </div>
                <JsonBlock code={NEGOTIATE_REQUEST} />
              </div>
            </div>
          </section>

          <section className="mb-12">
            <SectionHeading id="overview">Overview</SectionHeading>
            <p className="mb-4 max-w-2xl text-[0.9rem] leading-relaxed text-muted-foreground">
              All endpoints accept and return JSON. The base URL is the origin serving this page —
              relative paths work from any client.
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              {highlights.map(({ title, value, detail }) => (
                <div key={title} className="rounded-2xl border border-border/70 bg-surface/70 p-4 shadow-sm">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
                    {title}
                  </p>
                  <p className="mt-2 text-lg font-semibold">{value}</p>
                  <p className="mt-1 text-[0.84rem] text-muted-foreground">{detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <SectionHeading id="authentication">Authentication</SectionHeading>
            <div className="rounded-2xl border border-border/70 bg-surface/70 p-5 shadow-sm">
              <p className="max-w-2xl text-[0.9rem] leading-relaxed text-muted-foreground">
                No authentication is required. Endpoints are public and stateless — no data is stored
                between requests.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <MethodBadge method="GET" />
              <SectionHeading id="health">
                <code className="text-lg">/api/public/health</code>
              </SectionHeading>
            </div>
            <div className="rounded-2xl border border-border/70 bg-surface/70 p-5 shadow-sm">
              <p className="mb-5 max-w-2xl text-[0.9rem] leading-relaxed text-muted-foreground">
                Liveness probe. Returns <code className="text-code-string">{"{"}status": "ok"{"}"}</code>{" "}
                when the service is reachable.
              </p>
              <div className="grid gap-5 xl:grid-cols-2">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
                      Response · 200
                    </p>
                    <CopyButton text={`{"status": "ok"}`} />
                  </div>
                  <JsonBlock code={`{\n  "status": "ok"\n}`} />
                </div>
                <TryIt method="GET" path="/api/public/health" />
              </div>
            </div>
          </section>

          <section className="mb-12">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <MethodBadge method="POST" />
              <SectionHeading id="negotiate">
                <code className="text-lg">/api/public/negotiate</code>
              </SectionHeading>
            </div>
            <div className="rounded-2xl border border-border/70 bg-surface/70 p-5 shadow-sm">
              <p className="mb-5 max-w-2xl text-[0.9rem] leading-relaxed text-muted-foreground">
                Computes a fair middle-ground deal between two agents. Price is averaged; the later
                deadline is kept so the agreement preserves slack for both sides.
              </p>

              <div className="mb-6 grid gap-3 md:grid-cols-3">
                {workflowCards.map(({ title, text }) => (
                  <div key={title} className="rounded-xl border border-border/60 bg-background/70 p-4">
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
                      {title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>

              <h3 className="mb-2 font-mono text-[0.7rem] uppercase tracking-[0.25em] text-muted-foreground">
                Request body
              </h3>
              <div className="mb-5">
                <SchemaTable
                  fields={[
                    {
                      name: "agent_a",
                      type: "object",
                      required: true,
                      description: "First party's offer.",
                    },
                    {
                      name: "agent_a.price",
                      type: "number",
                      required: true,
                      description: "Offered price. Must be ≥ 0.",
                    },
                    {
                      name: "agent_a.deadline",
                      type: "number",
                      required: true,
                      description: "Days until the offer expires. Must be ≥ 0.",
                    },
                    {
                      name: "agent_b",
                      type: "object",
                      required: true,
                      description: "Second party's offer — same shape as agent_a.",
                    },
                  ]}
                />
              </div>

              <h3 className="mb-2 font-mono text-[0.7rem] uppercase tracking-[0.25em] text-muted-foreground">
                Response fields
              </h3>
              <div className="mb-6">
                <SchemaTable
                  fields={[
                    {
                      name: "price",
                      type: "number",
                      description: "Average of both prices, rounded to 2 decimals.",
                    },
                    {
                      name: "deadline",
                      type: "number",
                      description: "The later of the two deadlines.",
                    },
                    {
                      name: "rationale",
                      type: "string",
                      description: "Plain-language explanation of the compromise.",
                    },
                  ]}
                />
              </div>

              <div className="grid gap-5 xl:grid-cols-2">
                <div className="flex flex-col gap-5">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
                        Example request
                      </p>
                      <CopyButton text={NEGOTIATE_REQUEST} />
                    </div>
                    <JsonBlock code={NEGOTIATE_REQUEST} />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
                        Response · 200
                      </p>
                      <CopyButton text={NEGOTIATE_RESPONSE} />
                    </div>
                    <JsonBlock code={NEGOTIATE_RESPONSE} />
                  </div>
                  <div>
                    <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
                      Error · 400
                    </p>
                    <JsonBlock code={`{\n  "error": "\\"agent_a.price\\" must be a non-negative number"\n}`} />
                  </div>
                </div>
                <TryIt method="POST" path="/api/public/negotiate" defaultBody={NEGOTIATE_REQUEST} />
              </div>
            </div>
          </section>

          <section className="mb-20">
            <SectionHeading id="examples">Code examples</SectionHeading>
            <p className="mb-5 max-w-2xl text-[0.9rem] leading-relaxed text-muted-foreground">
              Drop-in snippets for calling the negotiation endpoint.
            </p>
            <div className="grid gap-5 xl:grid-cols-2">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
                    curl
                  </p>
                  <CopyButton text={CURL_EXAMPLE} />
                </div>
                <pre className="code-panel p-4">
                  <code>{CURL_EXAMPLE}</code>
                </pre>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
                    Python
                  </p>
                  <CopyButton text={PYTHON_EXAMPLE} />
                </div>
                <pre className="code-panel p-4">
                  <code>{PYTHON_EXAMPLE}</code>
                </pre>
              </div>
            </div>
          </section>

          <footer className="border-t border-border py-8 font-mono text-[0.7rem] text-muted-foreground">
            Deal Finder API · v1.0 · JSON over HTTPS
          </footer>
        </main>
      </div>
    </div>
  );
}
