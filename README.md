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
  lib/mockAnomalies.ts
  types/anomaly.ts
```

## Scripts

| Command       | Description          |
|---------------|----------------------|
| `npm run dev` | Start dev server     |
| `npm run build` | Production build   |
| `npm run start` | Run production     |
| `npm run lint` | ESLint              |
