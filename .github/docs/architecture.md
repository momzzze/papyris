# Papyris — TanStack Start Project Structure

## Short answer

Yes — **you can have both frontend and backend inside TanStack Start**, and **SSR is supported**.

TanStack Start is a **full-stack framework** with **full-document SSR**, **streaming**, **server functions**, and **server routes / API routes**. That means you can keep your UI, SSR pages, server-only logic, and HTTP endpoints in one app if you want.

A practical rule:

- Use **route components + loaders** for pages and SSR data.
- Use **server functions** for typed server-side actions called from your app.
- Use **server routes** when you need raw HTTP endpoints, webhooks, file uploads, binary responses, or public API-style routes.

TanStack Start's execution model is isomorphic by default, so server-only code should be intentionally isolated behind server functions, server routes, or other server-only boundaries.

---

## Recommended architecture for Papyris

- **TanStack Start** for dashboard, auth pages, docs pages, SSR marketing pages, playground UI
- **Server functions** for internal app actions
- **Server routes** for your public API endpoints
- **Separate worker process** for heavy PDF/image jobs later
- **Postgres** for users, API keys, billing, jobs, logs
- **Object storage** for generated files

---

## Folder structure

```txt
papyris/
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ .env
├─ public/
│  └─ favicon.ico
├─ src/
│  ├─ app/
│  │  ├─ providers/
│  │  │  ├─ query-provider.tsx
│  │  │  └─ theme-provider.tsx
│  │  ├─ components/
│  │  │  ├─ ui/
│  │  │  ├─ layout/
│  │  │  └─ forms/
│  │  ├─ styles/
│  │  │  └─ globals.css
│  │  └─ utils/
│  │     ├─ client-env.ts
│  │     └─ formatters.ts
│  │
│  ├─ routes/
│  │  ├─ __root.tsx
│  │  ├─ index.tsx                    # landing page (SSR)
│  │  ├─ pricing.tsx                  # pricing page (SSR)
│  │  ├─ docs.tsx                     # docs page
│  │  ├─ login.tsx
│  │  ├─ dashboard.tsx
│  │  ├─ dashboard/
│  │  │  ├─ api-keys.tsx
│  │  │  ├─ usage.tsx
│  │  │  ├─ jobs.tsx
│  │  │  └─ playground.tsx
│  │  ├─ api.render.pdf.ts            # POST /api/render/pdf
│  │  ├─ api.render.image.ts          # POST /api/render/image
│  │  ├─ api.transform.image.ts       # POST /api/transform/image
│  │  ├─ api.pdf.merge.ts             # POST /api/pdf/merge
│  │  ├─ api.jobs.$jobId.ts           # GET /api/jobs/:jobId
│  │  └─ webhook.stripe.ts            # Stripe webhook
│  │
│  ├─ server/
│  │  ├─ auth/
│  │  │  ├─ session.ts
│  │  │  ├─ api-key.ts
│  │  │  └─ permissions.ts
│  │  ├─ db/
│  │  │  ├─ client.ts
│  │  │  ├─ schema/
│  │  │  │  ├─ users.ts
│  │  │  │  ├─ api-keys.ts
│  │  │  │  ├─ jobs.ts
│  │  │  │  ├─ files.ts
│  │  │  │  └─ usage-logs.ts
│  │  │  └─ queries/
│  │  ├─ services/
│  │  │  ├─ render-service.ts
│  │  │  ├─ image-service.ts
│  │  │  ├─ pdf-service.ts
│  │  │  ├─ job-service.ts
│  │  │  ├─ storage-service.ts
│  │  │  └─ billing-service.ts
│  │  ├─ renderers/
│  │  │  ├─ html-to-pdf.ts
│  │  │  ├─ markdown-to-html.ts
│  │  │  ├─ html-to-image.ts
│  │  │  ├─ image-convert.ts
│  │  │  └─ pdf-merge.ts
│  │  ├─ validators/
│  │  │  ├─ render.schemas.ts
│  │  │  ├─ image.schemas.ts
│  │  │  └─ pdf.schemas.ts
│  │  ├─ lib/
│  │  │  ├─ logger.ts
│  │  │  ├─ env.ts
│  │  │  ├─ errors.ts
│  │  │  └─ rate-limit.ts
│  │  └─ constants/
│  │     ├─ plans.ts
│  │     └─ limits.ts
│  │
│  ├─ features/
│  │  ├─ auth/
│  │  ├─ dashboard/
│  │  ├─ playground/
│  │  ├─ api-keys/
│  │  └─ billing/
│  │
│  └─ integrations/
│     ├─ stripe/
│     ├─ s3/
│     └─ sentry/
│
├─ workers/
│  ├─ pdf-worker.ts
│  ├─ image-worker.ts
│  └─ queue.ts
│
└─ scripts/
   ├─ dev.ts
   └─ seed.ts
```

---

## MVP endpoints to build first

```
POST /api/render/pdf
POST /api/render/image
POST /api/transform/image
POST /api/pdf/merge
GET  /api/jobs/:jobId
GET  /api/files/:fileId
```

Internal server functions:

```
createApiKey()
revokeApiKey()
getUsageSummary()
getRecentJobs()
```

---

## Request models

### HTML → PDF

```json
{
  "source": "html",
  "content": "<html><body><h1>Hello</h1></body></html>",
  "options": {
    "format": "A4",
    "margin": "20mm",
    "printBackground": true
  }
}
```

### Markdown → PDF

```json
{
  "source": "markdown",
  "content": "# Invoice\n\nHello world",
  "theme": "default",
  "options": {
    "format": "A4"
  }
}
```

### Image transform

```json
{
  "inputFormat": "png",
  "outputFormat": "webp",
  "resize": {
    "width": 1200,
    "height": 630,
    "fit": "cover"
  }
}
```

---

## DB tables

```
users
api_keys
jobs
files
usage_logs
subscriptions
webhook_events
```

### jobs columns

- id, user_id, type (`render_pdf` | `render_image` | `transform_image` | `merge_pdf`)
- status (`queued` | `processing` | `done` | `failed`)
- input_meta, output_file_id, error_message, created_at, updated_at

### files columns

- id, user_id, storage_key, mime_type, size, checksum, created_at

### usage_logs columns

- id, user_id, api_key_id, endpoint, units, status_code, created_at

---

## Server-only boundaries — never leak to client

- DB client
- API key hashing / verification
- billing secrets
- storage credentials
- Playwright rendering logic
- job queue logic

---

## Stack

### App layer

- TanStack Start + Router + Query
- Tailwind CSS
- Zod

### Server layer

- Node.js, Playwright, Sharp, pdf-lib
- PostgreSQL + Drizzle (or Prisma)

### Infra (later)

- Redis / queue
- S3 or Cloudflare R2
- Stripe
- Sentry
