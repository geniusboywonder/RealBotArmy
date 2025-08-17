# GROK Architecture — Critical Review & Lightweight, Free/Open-Source Cloud Refactor

**Role assumed:** Principal Solutions Architect (per `architect_role.md`).  
**Date:** 15 Aug 2025

---

## Executive Summary (TL;DR)

- The current design is thoughtful and ambitious but **over-abstracted** for a lightweight, free, open‑source, cloud‑hosted MVP.
- **Biggest mismatches** with your constraints: reliance on commercial LLM APIs, using GitHub Codespaces as a runtime, a custom A2A protocol that increases coupling, and an in‑memory + JSONL “bus” that is fragile.
- **Refactor to a lean stack**: Cloudflare Pages (frontend) + Cloudflare Workers (backend, WebSockets, queues) + D1 (SQLite) or Supabase (Postgres + Realtime) + Ollama/vLLM (open‑source models) running on free hosting where possible (HF Spaces CPU) or local.
- Replace speculative tech (e.g., *POML*, *LangExtract*) with **established OSS** (Jinja2/DSPy/Outlines for prompts; LangGraph or plain Python FSM for orchestration).
- Keep the good parts: small set of agents, ReWOO‑style plan/work/solve loop, typed message schema, JSONL audit logs—**but** formalize persistence, retries, and observability.

---

## Scope & Assumptions

- **Goal:** Ship a small agent system that’s cheap (free tiers), simple to operate, and fully OSS-compatible.
- **Traffic:** low to modest (human-in-the-loop), occasional bursts.
- **Models:** favor **local/open** (Llama 3.1 8B, Qwen2.5 7B, Mistral 7B, GGUF/llama.cpp) with a plug‑in path to paid APIs later.
- **Security:** basic API key + rate limiting; no PII.
- **SLA:** best‑effort hobby uptime; graceful degradation is fine.

---

## What’s Solid ✅ vs What Needs Work ⚠️

| Area | What’s Solid | Gaps / Risks | Suggested Change |
|---|---|---|---|
| **Agent Topology** | Clear Planner→Worker→Solver separation; ReWOO‑style steps | Over‑generalized abstractions create complexity; custom A2A protocol | Fix the graph to 3‑5 nodes; use LangGraph **or** a simple Python state machine; drop custom wire protocol in favor of typed JSON over HTTP/WebSocket |
| **Orchestration** | Mentions LangGraph (good fit) | Heavy LangChain stack for small app; learning curve | Use **LangGraph lite** patterns, or implement a tiny FSM (pydantic models + function router) |
| **Transport** | WebSocket streaming noted | Codespaces not a production runtime; WS on hobby hosts can be tricky | Use **Cloudflare Workers** WS or **Supabase Realtime**; fall back to Server‑Sent Events for simplicity |
| **Message Bus** | In‑memory queue + JSONL for audit | Loses messages on crash; no backpressure; single point of failure | Start with **SQLite (D1/Turso/Supabase)** backed queue table + retries + idempotency keys |
| **Persistence** | JSONL logs are nice for audits | No rotation, schema/versioning, or queryability | Keep JSONL for append‑only audit; add **SQLite tables** for runs, steps, events; nightly rotation |
| **Prompting** | Separation of system/prompt hints | *POML/LangExtract* not standard; maintainability risk | Use **Jinja2 templates** or **DSPy/Outlines** for structure + type‑safe JSON output |
| **LLMs** | Mentions OpenAI/Anthropic | Violates “free/open-source”; cost risk | Default to **Ollama/vLLM** hosting small models (HF Spaces CPU) with model registry and adapters |
| **Observability** | JSONL logs exist | No metrics/tracing, hard to debug agents | Add **OpenTelemetry logs/traces**, simple Prometheus counters, request IDs, run viewers |
| **Security** | API key mention | No rate-limit, CORS, secret storage, input validation | Add **Upstash Redis** (free tier) for rate‑limit, signed HMAC request, pydantic validation |
| **DX/Testing** | Some test scaffolding mentioned | No load/chaos tests; no deterministic fixtures | Add **pytest + fixtures**, **hypothesis** property tests, **locust** micro‑load; record/replay transcripts |

---

## Biggest Mismatches to “Free + OSS + Cloud + Low Complexity”

1. **Hosting runtime = GitHub Codespaces** → great for *development*, not for production runtime. Codespaces sleep, have usage caps, and are not intended as an always‑on app host. Use it for dev only; deploy elsewhere.
2. **Custom A2A protocol** → YAGNI. A typed JSON schema + HTTP/WS is enough; use a small event catalog and version it.
3. **In‑memory queue** → loses data, no parallelism. Use a single SQLite table with status + retry_after + dead‑letter. It’s still “lite” and free.
4. **Proprietary LLMs by default** → swap for **Ollama/vLLM** (with GGUF models) and keep OpenAI as an optional adapter.
5. **Novel prompt DSLs** (*POML*, *LangExtract*) → choose boring tech: Jinja2 + pydantic JSON schemas; optional DSPy for prompt‑as‑code.

---

## Lean Reference Stack (Two Options)

### Option A — “All‑Cloudflare” (simplest deploy)

- **Frontend:** Cloudflare **Pages** (static React/Vite).  
- **Backend:** Cloudflare **Workers** (HTTP + WebSocket streaming).  
- **Storage:** **D1** (SQLite) for runs/queues/config; **R2** optional for artifacts.  
- **Rate limit / KV:** Workers **KV** or **Upstash Redis** (free).  
- **Models:** call an **Ollama** endpoint you run on a tiny VM or **Hugging Face Spaces (CPU)** for true $0.  
- **Pros:** all on one platform; generous free tier; WS supported; low ops.  
- **Cons:** not pure OSS hosting (Cloudflare is proprietary), but stack uses OSS runtimes (SQLite/llama.cpp).

### Option B — “Supabase + Pages” (richer realtime)

- **Frontend:** Cloudflare **Pages**.  
- **Backend:** Cloudflare **Workers** (or small FastAPI on free service).  
- **DB + Realtime:** **Supabase** (Postgres, OSS) for durable queue (LISTEN/NOTIFY or Realtime) and auth.  
- **Cache/rate‑limit:** **Upstash Redis** (free) or Postgres advisory locks.  
- **Models:** **Ollama/vLLM** as above.  
- **Pros:** SQL-first, realtime channels, auth.  
- **Cons:** Supabase is a managed service (open-source stack), but still a vendor.

> Both options keep the app **small, cheap, and replaceable**. You can switch later to Render/Fly/Railway if you decide to pay.

---

## Minimal Data Model (SQLite/Postgres)

- `runs(id, created_at, status, user_id, input_hash)`  
- `steps(id, run_id, name, state, started_at, finished_at, tokens_in, tokens_out, error)`  
- `events(id, run_id, step_id, type, payload_json, ts)`  
- `queue(id, topic, payload_json, visible_after, attempts, max_attempts, dedupe_key, locked_by, locked_at)`  
- `artifacts(id, run_id, kind, uri, sha256, size)`

All entities are small enough for **SQLite**; D1/Turso/Supabase work fine.

---

## Transport & Streaming

- Prefer **WebSocket** for bidirectional agent events; fallback to **SSE** if the host limits WS.  
- Define a tiny event catalog: `run.created`, `step.started`, `tool.requested`, `tool.result`, `step.completed`, `run.completed`, `run.failed`—all JSON, versioned with `schema=1`.
- Use **idempotency keys** (`x-idempotency-key`) and **at‑least-once** delivery for queue consumers.

---

## Prompting & Output Contracts

- **Templates:** Jinja2 with environment‑versioned templates.  
- **Output typing:** pydantic `BaseModel` + structured JSON; set `temperature=0.2` for tools/planning.  
- **Programmatic prompting:** optional **DSPy**/**Outlines** to keep prompts deterministic and composable.  
- **Guardrails:** max turns, token budget, stop‑reasons, schema timeouts; reject‑on‑invalid JSON with one retry.

---

## Security, Privacy, and Ops

- **Auth:** simple API key or Supabase Auth; signed timestamps on write endpoints.  
- **Rate limit:** Redis token bucket (Upstash) or DB-based leaky bucket.  
- **Secrets:** environment bindings (Workers) or Supabase secrets; never hard‑code.  
- **PII:** redact logs by field allow‑list; separate audit JSONL from operational tables.  
- **Observability:** OpenTelemetry logs/traces (OTLP); basic counters (requests, runs, failures, queue lag).  
- **Backups:** nightly export of SQLite to object storage; verify restore monthly.

---

## Updated Component Sketch (Mermaid)

```mermaid
flowchart LR
  UI[React UI (Cloudflare Pages)] --- WS((WebSocket/SSE))
  WS --- API[Cloudflare Worker API]
  API --> QUEUE[(Queue table: D1/Supabase)]
  API --> DB[(Runs/Steps/Events: D1/Supabase)]
  API <--> RL[Rate Limit (Upstash/Workers KV)]
  API <--> MODELS[Ollama/vLLM (HF Spaces or tiny VM)]
  MODELS <--> TOOLS[Tools: HTTP, scraping, RAG]
  subgraph Storage
    DB
    QUEUE
  end
  subgraph Observability
    LOGS[[JSONL Audit + OTEL]]
  end
  API --> LOGS
  UI --> LOGS
```

---

## “Keep / Change / Drop” Checklist

- **Keep:** small agent set; ReWOO‑like phases; JSONL audit; typed messages; streaming UX.  
- **Change:** hosting (deploy to Workers/Pages); message bus → SQLite; drop custom A2A; standardize prompts; add metrics.  
- **Drop (for now):** *POML*, *LangExtract*, multi‑provider LLM adapters (until needed), any per‑agent bespoke protocol.

---

## First 1–2 Weeks (Do This)

1. Scaffold Worker API with WS + SSE endpoints and JSON schema validation.  
2. Create D1/Supabase schema; implement queue consumer with retries & dead‑letter.  
3. Stand up **Ollama** (Llama 3.1 8B Q4_K_M) on HF Spaces CPU or a tiny VM; wrap with OpenAI‑compatible adapter.  
4. Build Planner→Worker→Solver graph as **3 functions**; add tests + transcripts.  
5. Ship React UI on Pages; render live events.  
6. Add rate limiting + API keys; ship basic admin run viewer.  
7. Instrument OTEL + counters; rotate JSONL logs nightly.

---

## Appendix: Non‑Goals (Now)

- Horizontal scale > 1 worker shard; paid GPUs; vector DB; multi‑tenant SSO; complicated agent marketplaces.

---

## Appendix: Example Event (Typed JSON)

```json
{
  "schema": 1,
  "event": "step.completed",
  "run_id": "run_01H...",
  "step_id": "step_01H...",
  "name": "worker.extract",
  "ts": "2025-08-15T08:10:00Z",
  "metrics": {"tokens_in": 512, "tokens_out": 128, "latency_ms": 820},
  "result": {"status": "ok", "outputs": [{"key": "facts", "value": ["..."]}]}
}
```

---

### Final Thought

Pick **boring, proven OSS** and free serverless where possible. Your best path to reliability at $0 is **Workers/Pages + D1** (or **Supabase**) + **Ollama/vLLM**. Everything else is optional until you have users.
