# Adaptive Learning

## Project Structure
- `doc/`: product and technical specs
- `web/`: React (Vite) web UI
- `backend/`: AWS Lambda-style handlers for ChatGPT (OpenAI API)

## Quick Start
Web UI:
```bash
cd web
npm install
npm run dev
```

Backend (Lambda handler):
- Set `OPENAI_API_KEY` and optionally `OPENAI_MODEL`.
- Deploy `backend/handlers/chatgpt.js` with Node.js 18+ runtime.

## Backend Handlers
- `backend/handlers/events.js`: ingest learner events
- `backend/handlers/classify.js`: classify learner state
- `backend/handlers/next-moment.js`: select the next learning moment
- `backend/handlers/metrics.js`: basic evaluation metrics
- `backend/handlers/profile.js`: read/update learner profile
