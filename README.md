# Automated Outreach Pipeline

A fully automated B2B outreach pipeline built with **Next.js 15**, **Ocean.io**, **Prospeo**, and **Brevo**. Enter a target company domain, and the system autonomously source lookalikes, extracts decision-makers, filters them through a safety dashboard, and triggers personalized email campaigns.

---

## 🚀 How It Works

```text
company.domain
      │
      ▼
┌─────────────┐
│  Ocean.io   │  Find lookalike companies
└──────┬──────┘
       ▼
┌─────────────┐
│   Prospeo   │  Find decision-makers & extract emails
└──────┬──────┘
       ▼
┌─────────────┐
│  Checkpoint │  Safety review dashboard (Manual/Auto validation)
└──────┬──────┘
       ▼
┌─────────────┐
│    Brevo    │  Send highly personalized outreach emails
└─────────────┘
```

Every stage automatically feeds into the next stage with built-in deduplication, rate limiting, and robust error handling.

---

## 🛠️ Tech Stack

*   **Framework:** Next.js 15 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **HTTP Client:** Axios
*   **Integrations:** Ocean.io API, Prospeo API, Brevo (SIB) API
*   **Deployment:** Vercel

---

## 📁 Project Structure

```text
├── app/
│   ├── page.tsx                     # Main UI - pipeline dashboard
│   └── api/
│       ├── pipeline/
│       │   └── route.ts             # POST /api/pipeline (Orchestrator)
│       ├── send/
│       │   └── route.ts             # POST /api/send (Single email)
│       ├── send-bulk/
│       │   └── route.ts             # POST /api/send-bulk (Bulk outreach)
│       ├── test-ocean/
│       │   └── route.ts             # Connection test for Ocean.io
│       └── test-prospeo/
│           └── route.ts             # Connection test for Prospeo
├── components/
│   └── ui/                          # Reusable UI elements (buttons, inputs)
├── lib/
│   ├── api-clients.ts               # Axios instances & global API configs
│   └── utils.ts                     # Tailwind merging & formatting helpers
├── services/
│   ├── ocean.service.ts             # Ocean.io company lookup logic
│   ├── prospeo.service.ts           # Prospeo target extraction
│   ├── prospeo-enrich.service.ts    # Contact data enrichment & verification
│   ├── pipeline.service.ts          # State machine & pipeline orchestration
│   └── brevo.service.ts             # Brevo SMTP/Transactional wrapper
├── types/
│   ├── company.ts                   # Ocean.io payloads & interfaces
│   ├── contact.ts                   # Prospeo payloads & verified formats
│   ├── pipeline.ts                  # Run metadata & global state shapes
│   └── pipeline-status.ts           # Status enums (IDLE, PROCESSING, etc.)
├── utils/
│   └── error-handler.ts             # Centralized API error parsing & logging
├── .env.local                       # Private environment configurations
├── package.json                     # Node dependencies
└── tsconfig.json                    # TypeScript compiler rules
```

---

## 📋 Features Checklist


| Requirement           | Status | Notes                                    |
| --------------------- | ------ | ---------------------------------------- |
| Single domain input   | ✅      | One input starts the entire workflow     |
| Ocean.io integration  | ✅      | Lookalike company discovery              |
| Prospeo integration   | ✅      | Decision-maker discovery                 |
| Email discovery       | ✅      | Uses Prospeo contact data                |
| Brevo integration     | ✅      | Personalized email delivery              |
| Safety checkpoint     | ✅      | Contact review before outreach           |
| Bulk outreach         | ✅      | Sends emails to multiple contacts        |
| Deduplication         | ✅      | Company and contact deduplication        |
| Error handling        | ✅      | API failures handled gracefully          |
| Rate limit handling   | ✅      | Request throttling implemented           |
| Personalized outreach | ✅      | Name, title, and company personalization |

---

## ⚙️ Environment Setup

Create a `.env.local` file in your root directory and add the following keys:

```env
# Ocean.io Settings
OCEAN_API_KEY=your_ocean_io_api_key_here

# Prospeo Settings
PROSPEO_API_KEY=your_prospeo_api_key_here

# Brevo (Sendinblue) Settings
BREVO_API_KEY=your_brevo_api_key_here
BREVO_SENDER_NAME="Your Name / Company"
BREVO_SENDER_EMAIL=hello@yourdomain.com
```

---

## 🏁 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com
cd automated-outreach-pipeline
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the pipeline dashboard.

### 3. Production Build
```bash
npm run build
npm run start
```

---

## 🔌 API Documentation

### `POST /api/pipeline`
Triggers or proceeds with the pipeline tracking stage.
*   **Payload:** `{ domain: "targetcompany.com" }`
*   **Behavior:** Sours lookalikes from Ocean.io and fetches contacts via Prospeo before hitting the pause checkpoint.

### `POST /api/send-bulk`
Triggers actual outbound emails via Brevo for all approved targets inside the checkpoint.
*   **Payload:** `{ contacts: [ { email: "...", firstName: "..." } ] }`

---

## 🛡️ Safety Checkpoint & Rules
To protect your sender domain reputation, the pipeline utilizes a **Safety Review UI Step**:
*   **Deduplication:** The pipeline hashes emails to skip duplicates inside the same run.
*   **Verification:** Automatically filters out invalid syntax or risky domains parsed during the `prospeo-enrich` phase.
*   **Personalization Fallbacks:** If a specific title or name is missing, the email template drops back safely to broad company placeholders.
