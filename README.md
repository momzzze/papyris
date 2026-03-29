# Papyris — TanStack Start Project Structure

## Short answer

Yes — **you can have both frontend and backend inside TanStack Start**, and **SSR is supported**.

TanStack Start is a **full-stack framework** with **full-document SSR**, **streaming**, **server functions**, and **server routes / API routes**. That means you can keep your UI, SSR pages, server-only logic, and HTTP endpoints in one app if you want. citeturn814423search1turn814423search0turn814423search7

A practical rule:

- Use **route components + loaders** for pages and SSR data.
- Use **server functions** for typed server-side actions called from your app.
- Use **server routes** when you need raw HTTP endpoints, webhooks, file uploads, binary responses, or public API-style routes. citeturn814423search2turn814423search0

TanStack Start docs also note that code is **isomorphic by default**, so server-only code should be intentionally isolated behind server functions, server routes, or other server-only boundaries. citeturn814423search6

---

## Recommended architecture for Papyris

For your product, the clean setup is:

- **TanStack Start** for dashboard, auth pages, docs pages, SSR marketing pages, playground UI
- **Server functions** for internal app actions
- **Server routes** for your public API endpoints
- **Separate worker process** for heavy PDF/image jobs later
- **Postgres** for users, API keys, billing, jobs, logs
- **Object storage** for generated files

That gives you one codebase to start fast, while still leaving room to split heavy processing later.

---

## Suggested folder structure

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

## Why this structure works

### `src/routes/`

Keep both UI pages and API endpoints here.

Use it for:

- landing page
- pricing page
- docs page
- dashboard pages
- API routes like `/api/render/pdf`
- webhooks

This matches TanStack Start’s file-based route approach and server route support. citeturn814423search0turn814423search1

### `src/server/`

Keep all backend logic here.

Use it for:

- DB access
- auth/session logic
- API key validation
- rendering services
- billing logic
- validation
- storage integration

This prevents route files from becoming giant controller files.

### `workers/`

Do **not** keep Chrome/Playwright-heavy rendering forever inside the web request lifecycle.

Start simple in-process if you want.
Later move heavy jobs here for:

- HTML → PDF
- URL → PDF
- image transformations
- merging large PDFs

That will protect your SSR app from becoming slow under load.

---

## Recommended feature split

### Frontend / SSR part

Use TanStack Start for:

- marketing site
- docs
- pricing
- login/register
- dashboard
- API playground
- request history UI

### Backend / API part

Use TanStack Start server routes for:

- `POST /api/render/pdf`
- `POST /api/render/image`
- `POST /api/transform/image`
- `POST /api/pdf/merge`
- `GET /api/jobs/:id`
- `POST /api/webhooks/stripe`

### Internal server functions

Use server functions for:

- create API key
- revoke API key
- fetch usage summary
- create billing portal session
- update profile

Server functions are designed for server-only logic callable from app code, while server routes are better for raw HTTP endpoints. citeturn814423search2turn814423search0

---

## Best way to think about FE + BE in TanStack Start

Yes, you can absolutely do:

- **FE**: React UI with SSR
- **BE**: server functions + API routes
- **same repo**
- **same deployment**

That is a valid full-stack setup in TanStack Start. TanStack Start explicitly describes itself as a full-stack framework with SSR, streaming, server functions, and server routes. citeturn814423search1turn814423search7

But for your specific product, I would structure it in **three layers**:

1. **UI layer** — dashboard and docs
2. **API layer** — public render/transform endpoints
3. **processing layer** — heavy workers for PDF/image jobs

That keeps the product clean and scalable.

---

## MVP endpoints to build first

```txt
POST /api/render/pdf
POST /api/render/image
POST /api/transform/image
POST /api/pdf/merge
GET  /api/jobs/:jobId
GET  /api/files/:fileId
```

Optional internal actions through server functions:

```txt
createApiKey()
revokeApiKey()
getUsageSummary()
getRecentJobs()
```

---

## Suggested render request models

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

## Suggested DB tables

```txt
users
api_keys
jobs
files
usage_logs
subscriptions
webhook_events
```

### `jobs`

Recommended columns:

- id
- user_id
- type (`render_pdf`, `render_image`, `transform_image`, `merge_pdf`)
- status (`queued`, `processing`, `done`, `failed`)
- input_meta
- output_file_id
- error_message
- created_at
- updated_at

### `files`

Recommended columns:

- id
- user_id
- storage_key
- mime_type
- size
- checksum
- created_at

### `usage_logs`

Recommended columns:

- id
- user_id
- api_key_id
- endpoint
- units
- status_code
- created_at

---

## What should stay server-only

Do not leak these into client code:

- DB client
- API key hashing/verification
- billing secrets
- storage credentials
- Playwright rendering logic
- job queue logic

TanStack Start’s execution model is isomorphic by default, so server-only logic needs clear boundaries. citeturn814423search6

---

## Suggested stack inside this structure

### App layer

- TanStack Start
- TanStack Router
- TanStack Query
- Tailwind CSS
- Zod

### Server layer

- Node.js
- Playwright
- Sharp
- pdf-lib
- PostgreSQL
- Drizzle or Prisma

### Infra later

- Redis / queue
- S3 or Cloudflare R2
- Stripe
- Sentry

---

## Practical recommendation

### Good for MVP

Use **one TanStack Start app** with:

- SSR pages
- dashboard
- docs
- API routes
- simple in-process rendering

### Good for scale

Keep the same repo, but split heavy work into:

- TanStack Start app
- worker process

That is the safest path.

---

## Final answer

Yes — **TanStack Start can absolutely be your FE + BE with SSR**.

A very good setup for Papyris is:

- **TanStack Start** for website, dashboard, docs, SSR pages
- **Server routes** for public API endpoints
- **Server functions** for internal dashboard actions
- **Workers** for heavy rendering jobs

That gives you one coherent full-stack system without mixing UI code and rendering engine code into the same files. citeturn814423search1turn814423search2turn814423search0turn814423search6
