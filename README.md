# Pass & Verification System

A simple check-in system: an admin creates a pass with a unique entry code, and a verifier redeems it once by code.

- **Backend:** NestJS (REST API) + PostgreSQL (TypeORM)
- **Frontend:** Next.js (App Router)
- **Notifications:** stubbed in-app push dispatch on successful verification (SMS/WhatsApp channels stubbed, not implemented)

## Live Links

- Frontend (Vercel): https://pass-system-tau.vercel.app
- Backend (Railway): https://pass-system-production.up.railway.app
- Swagger/OpenAPI docs: https://pass-system-production.up.railway.app/api

## Endpoints

| Method | Path             | Description                                                                 |
| ------ | ---------------- | ---------------------------------------------------------------------------- |
| POST   | `/passes`        | Create a pass. Generates a unique code, stores it as `PENDING`.              |
| POST   | `/passes/verify` | Redeem a pass by `code`. Marks it `USED` if valid, otherwise returns an error. |

**`POST /passes`**

Request body:

```json
{
  "name": "Ada Lovelace",
  "host": "Reception",
  "validDate": "2099-12-31"
}
```

Response `201`:

```json
{ "id": "uuid", "code": "V1StGXR8_Z", "status": "PENDING" }
```

**`POST /passes/verify`**

Request body:

```json
{ "code": "V1StGXR8_Z" }
```

| Status | Meaning                                      |
| ------ | --------------------------------------------- |
| 201    | Verified — pass marked `USED`                  |
| 404    | Unknown code                                   |
| 409    | Pass already used                              |
| 410    | Pass expired (past `validDate`, still `PENDING`) |

A full Postman collection covering all four cases is at [`postman_collection.json`](postman_collection.json) — import it into Postman and set the `base_url` variable (defaults to `http://localhost:3000`).

Interactive Swagger/OpenAPI docs are also served by the running backend at `/api` (raw spec at `/api-json`) — live at https://pass-system-production.up.railway.app/api.

## Setup & Run

### Prerequisites

- Node.js + npm
- A running PostgreSQL instance

### Backend

```bash
cd backend
cp .env.example .env   # edit DATABASE_URL to point at your Postgres instance
npm install
npm run start:dev      # runs on http://localhost:3000
```

Env vars (`backend/.env.example`):

```
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/passes
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev             # runs on http://localhost:3001 (or next available port)
```

Env vars (`frontend/.env.example`):

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Pages:

- `/` — landing page with links to Create and Verify
- `/create` — form to issue a pass (name, host, valid date); shows the generated code + QR code
- `/verify` — enter/scan a code to redeem it; shows USED / already-used / expired / invalid outcomes

### Tests

```bash
cd backend
npm run test       # unit tests
npm run test:e2e   # integration tests
npm run test:all   # both
```

## Written Note

### 1. Shipping as native iOS/Android apps alongside the web version

I'd keep the NestJS backend as the single source of truth and build native clients on top rather than duplicating logic. For mobile, I'd use **React Native** (with Metro as the bundler) over separate Swift/Kotlin codebases — this domain (forms, a QR scan flow, REST calls) doesn't need much beyond the camera, and a plain React Native + Metro setup gives full control over native modules and build config without an extra managed layer.

I'd extract the API client and validation logic into a shared package used by both the Next.js and React Native apps. The backend needs no changes, it's already a stateless, CORS-enabled REST API. The one addition I'd consider is push notifications for verifiers via `NotificationsService`, already stubbed in.

### 2. Choosing between push, SMS, and WhatsApp per event, cost-consciously

I'd decide by **urgency, delivery guarantee, and cost**, in that order. Push is free and near-instant but only reaches users with the app installed — fine for low-stakes confirmations like "pass verified." SMS costs per message but has near-universal reach, so I'd reserve it for events where delivery matters more than cost (e.g. an expired unused pass, or a security event). WhatsApp sits in between — often cheaper than SMS with richer formatting, but needs the recipient on WhatsApp and, for business use, a paid Business API — best when the user base is already WhatsApp-heavy.

`NotificationsService.dispatch(event, channel)` already models this as a per-event channel choice, with only push implemented and SMS/WhatsApp stubbed as logged no-ops — matching the brief's "implement only what's needed now."
