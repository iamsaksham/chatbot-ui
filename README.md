# chatbot-ui

A [Next.js](https://nextjs.org/) app that provides a streaming chat UI. The main experience uses custom API route that streams tokens from OpenAI via a stream.

## Features

- **Streaming chat** — Messages are streamed from `gpt-4o-mini` (LangChain → SDK message stream).
- **Non-streaming API (optional)** — `/api/chat` demonstrates the OpenAI **Responses** API with a fixed “pirate” system style (uses `OPEN_AI_KEY` only).

## Requirements

- **Node.js** — Use a current LTS version compatible with your Next.js release (for example **Node 20** or newer).
- **npm** (or pnpm / yarn) for installing dependencies.
- **OpenAI API key** — The streaming route needs a key with access to the configured model (`gpt-4o-mini`).

## Environment variables

Create a file named **`.env.local`** in the project root (Next.js loads it automatically). Restart the dev server after any change.

| Variable | Used by | Description |
|----------|---------|-------------|
| `OPENAI_API_KEY` | `/api/chatstream` (preferred) | Standard OpenAI API key. |
| `OPEN_AI_KEY` | `/api/chatstream`, `/api/chat` | Alternate name; streaming accepts `OPENAI_API_KEY` **or** `OPEN_AI_KEY`. Non-streaming `/api/chat` expects **`OPEN_AI_KEY`**. |

Set at least one of `OPENAI_API_KEY` or `OPEN_AI_KEY` for the default UI, which calls `/api/chatstream`.

> **Security:** Do not commit `.env.local` or real API keys. It should stay in `.gitignore`.

## Getting started

```bash
npm install
```

Add `.env.local` with your key(s), then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server. |
| `npm run build` | Production build. |
| `npm run start` | Run the production server (after `build`). |
| `npm run lint` | Run ESLint. |

## Configuration notes

- **Model** — Both API routes use `gpt-4o-mini`. Change the model strings in the route files if you need a different model.
- **Streaming timeout** — `chatstream` sets `maxDuration = 30` (seconds) for the route; adjust on your hosting platform if responses can run longer.

