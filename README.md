# Anomaly Detection

Next.js front-end for industrial asset anomaly monitoring and remediation workflows.

## Features

- **Anomaly List** — table of detected anomalies with ID, asset, priority, reason, and solution actions
- **Anomaly Solution** — placeholder workspace opened when a solution button is clicked (e.g. Deploy Field Agent)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API integration

The app calls `GET http://127.0.0.1:8000/anomaly_hist`. By default it serves **mock data** that matches the API response shape.

To switch to the live API, copy `.env.local.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_USE_MOCK_API=false
```

## Project structure

```
src/
  app/
    page.tsx                          # Anomaly list (home)
    anomaly/[id]/solution/page.tsx    # Solution workspace
  components/
    AnomalyList.tsx
    AnomalySolution.tsx
    AppShell.tsx
    PriorityBadge.tsx
  lib/
    api/anomalies.ts                  # fetchAnomalyHist + getAnomalies
    api/config.ts                     # API base URL & mock toggle
    mock/anomalyHistResponse.ts       # mock /anomaly_hist payload
    mappers/anomalyMapper.ts          # API → UI mapping
  types/
    anomaly.ts
    api.ts
```

## Scripts

| Command       | Description          |
|---------------|----------------------|
| `npm run dev` | Start dev server     |
| `npm run build` | Production build   |
| `npm run start` | Run production     |
| `npm run lint` | ESLint              |
