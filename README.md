# Automated Outreach Pipeline

A fully automated cold-outreach pipeline built with Next.js — one domain in, four stages fire, emails land. Zero human steps after the initial input.

---

## How It Works

```
company.domain
     │
     ▼
┌─────────────┐
│  Ocean.io   │  Find lookalike companies via seed domain
└──────┬──────┘
       ▼
┌─────────────┐
│   Prospeo   │  Surface C-suite / VP decision-makers + LinkedIn URLs
└──────┬──────┘
       ▼
┌─────────────┐
│  Eazyreach  │  Resolve LinkedIn profiles → verified work emails
└──────┬──────┘
       ▼
┌─────────────┐
│    Brevo    │  Send personalized outreach emails automatically
└─────────────┘
```

Every stage's output is the next stage's input — no copy-paste, no manual handoffs.

---

## Requirements Checklist

| Requirement | Status | Notes |
|---|---|---|
| Single domain input | ✅ | One text field, everything else is automated |
| Ocean.io integration | ✅ | `ocean.service.ts` — lookalike company search |
| Prospeo integration | ✅ | `prospeo.service.ts` — decision-maker extraction |
| Eazyreach integration | ⚠️ | Stubbed in pipeline — needs `eazyreach.service.ts` wired in |
| Brevo email sending | ✅ | `brevo.service.ts` — personalized HTML emails via `/api/send-bulk` |
| Safety checkpoint | ✅ | UI shows full contact summary before "Send Outreach" fires |
| De-duplication | ✅ | LinkedIn URL dedup in `pipeline.service.ts`; domain dedup in `ocean.service.ts` |
| Rate limit handling | ✅ | `sleep(1500)` between API calls; Prospeo rate limit headers logged |
| Partial failure resilience | ✅ | Try/catch in all services; failed enrichments push original contact |
| Modular code structure | ✅ | One service file per stage |
| Personalized email copy | ✅ | Name, title, and company injected into every email |

> **⚠️ Eazyreach note:** The pipeline currently uses Prospeo's built-in email field. To fully wire Eazyreach as Stage 3, uncomment the enrichment block in `pipeline.service.ts` and replace it with your `eazyreach.service.ts` calls.

---

## Project Structure

```
├── app/
│   ├── page.tsx                  # Main UI — pipeline dashboard
│   └── api/
│       ├── pipeline/route.ts     # POST /api/pipeline — runs all stages
│       └── send-bulk/route.ts    # POST /api/send-bulk — fires Brevo emails
├── services/
│   ├── ocean.service.ts          # Stage 1: Ocean.io lookalike search
│   ├── prospeo.service.ts        # Stage 2: Prospeo decision-maker search
│   ├── prospeo-enrich.service.ts # Stage 2b: Prospeo person enrichment (optional)
│   ├── pipeline.service.ts       # Orchestrator: chains all stages
│   └── brevo.service.ts          # Stage 4: Brevo email dispatch
├── types/
│   ├── contact.ts
│   └── company.ts
└── .env.local                    # API keys (never commit this)
```

---

## Local Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd outreach-pipeline
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Ocean.io
OCEAN_API_KEY=your_ocean_api_key

# Prospeo
PROSPEO_API_KEY=your_prospeo_api_key

# Brevo
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_NAME=Your Name
BREVO_SENDER_EMAIL=you@yourdomain.com
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), enter a domain, and hit **Run pipeline**.

---

## Deploy to Vercel

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables (do this once, or via Vercel dashboard)
vercel env add OCEAN_API_KEY
vercel env add PROSPEO_API_KEY
vercel env add BREVO_API_KEY
vercel env add BREVO_SENDER_NAME
vercel env add BREVO_SENDER_EMAIL

# Redeploy after adding env vars
vercel --prod
```

### Via Vercel Dashboard

1. Push your repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → Import your repo
3. Under **Environment Variables**, add all five keys from the `.env.local` section above
4. Click **Deploy**

> The app uses Next.js API Routes — Vercel handles them as serverless functions automatically. No extra configuration needed.

---

## API Endpoints

### `POST /api/pipeline`

Runs all pipeline stages for a given domain.

**Request:**
```json
{ "domain": "stripe.com" }
```

**Response:**
```json
{
  "summary": {
    "companiesFound": 1,
    "contactsFound": 8,
    "verifiedEmails": 4,
    "revealedEmails": 2
  },
  "companies": [...],
  "contacts": [
    {
      "personId": "abc123",
      "name": "Jane Smith",
      "title": "VP of Engineering",
      "email": "jane@company.com",
      "emailStatus": "VERIFIED",
      "linkedinUrl": "https://linkedin.com/in/janesmith",
      "companyName": "Acme Corp"
    }
  ]
}
```

### `POST /api/send-bulk`

Sends Brevo outreach emails to a list of contacts.

**Request:**
```json
{
  "contacts": [
    { "name": "Jane Smith", "email": "jane@company.com", "title": "VP of Engineering", "companyName": "Acme Corp" }
  ]
}
```

**Response:**
```json
{
  "summary": { "totalContacts": 4, "sent": 4, "failed": 0, "skipped": 0 },
  "results": [...]
}
```

---

## Rate Limits & Constraints

| Service | Limit | How it's handled |
|---|---|---|
| Ocean.io | Varies by plan | Companies sliced to `1` to stay safe |
| Prospeo | Per-minute + daily | `sleep(1500)` between calls; headers logged |
| Brevo | 300 emails/day (free) | Contacts sliced to top 10 |

To increase throughput, raise the `.slice()` limits in `pipeline.service.ts` once you're on paid tiers.

---

## Known Gaps / Next Steps

- [ ] Wire Eazyreach as a dedicated Stage 3 (currently bypassed)
- [ ] Uncomment enrichment loop in `pipeline.service.ts` for deeper contact data
- [ ] Add a `confirmed` gate in the UI before emails fire (currently one-click)
- [ ] Persist pipeline runs to a database (e.g. Vercel Postgres / Supabase)
- [ ] Add webhook support for Brevo delivery receipts

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **UI:** Tailwind CSS + shadcn/ui
- **APIs:** Ocean.io, Prospeo, Brevo
- **Deploy:** Vercel (zero-config)
- **HTTP client:** axios

---

## License

MIT