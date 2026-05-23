# MailPilot

A lightweight AI-assisted email automation and dashboard project. MailPilot processes incoming emails, classifies them, generates draft replies using LLM providers, and exposes a dashboard for managing rules and viewing logs.

## Key Features

- Email ingestion and parsing
- Category-based rules and auto-replies
- AI draft generation (supports Ollama / OpenRouter / OpenAI)
- Dashboard UI for managing rules, viewing logs and drafts
- Database persistence with Prisma (PostgreSQL)

## Repo layout

- `apps/backend` — Node/Express backend, Prisma, workers and email processing
- `apps/dashboard` — Vite + React frontend UI
- `docker-compose.yml` / `docker-compose.prod.yml` — compose files for local and production

## Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Docker & Docker Compose (for containerized setup)
- PostgreSQL (if running locally without Docker)

## Quickstart — Local (two apps)

1. Start the backend

```bash
cd apps/backend
npm install
# create .env from example or set required env vars
# Example: DATABASE_URL=postgresql://user:pass@localhost:5432/mailpilot
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

2. Start the dashboard

```bash
cd ../dashboard
npm install
npm run dev
# open http://localhost:5173 (vite default) or the host/port shown in the terminal
```

Notes:

- The backend dev server uses `tsx watch src/server.ts` (see `apps/backend/package.json`).
- If you run the backend on a different host/port, update the frontend API base URL in `apps/dashboard/src/api/client`.

## Environment variables

Create a `.env` file in `apps/backend` with at least the following keys:

- `DATABASE_URL` — PostgreSQL connection string (required)
- `PORT` — backend port (optional, default 3000)
- `OLLAMA_API_KEY` — (if using Ollama provider)
- `OPENROUTER_API_KEY` / `OPENROUTER_URL` — (if using OpenRouter)
- `OPENAI_API_KEY` — (if using OpenAI)
- `SMTP_*` / `GMAIL_*` — email sending credentials (if mail sending is enabled)

The project does not check in secret files. If the repository contains an `.env.example` file, copy it and fill values.

## Database / Prisma

Prisma is configured in `apps/backend/prisma/schema.prisma` and uses PostgreSQL as the datasource.

Common Prisma commands (from `apps/backend`):

```bash
npx prisma generate
npx prisma migrate dev --name <migration-name>
npx prisma studio
```

## Docker / Production

This repo includes Docker setup and compose files for running the stack in containers.

- Local compose (development):

```bash
docker compose up --build
```

- Production compose (example):

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Check `DOCKER_SETUP.md` and `DOCKER_FILES_SUMMARY.md` for notes on images, ports and volumes.

## Testing & Linting

- Backend: no unit tests included by default. Run `npm run test` in `apps/backend` (placeholder).
- Dashboard: run `npm run lint` in `apps/dashboard` to run ESLint.

## Observability & Logs

- The backend uses `pino` for structured logging. Check console output or container logs for runtime information.

## Contributing

Please open issues or pull requests. When contributing:

- Follow existing code style
- Add small, focused commits and a clear PR description

## Screenshots

![Dashboard Category view](docs/screenshots/category.png)
![Dashboard Log view](docs/screenshots/systemLog.png)
![Mail reply](docs/screenshots/mailreply.png)
![Mail chain reply](docs/screenshots/mailchainreply.png)

## Useful file references

- Backend entry: apps/backend/src/server.ts
- Frontend entry: apps/dashboard/src/main.tsx
- Prisma schema: apps/backend/prisma/schema.prisma

## License

This project is provided under the terms of the repository LICENSE file.
