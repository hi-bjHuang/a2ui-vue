# a2ui-vue

English | [中文](README.zh-CN.md)

Vue renderer for A2UI (Agent-to-User Interface).

This repository contains the reusable Vue renderer package and an `a2ui_explorer`
demo app. The explorer can be uploaded or deployed as a lightweight demo for
browsing A2UI basic catalog examples and testing an A2A agent chat flow.

## Packages

- `src/`: Vue renderer source exported as `@hi-bjhuang/a2ui-vue`.
- `a2ui_explorer/`: Vite demo app that renders catalog examples and connects to
  an A2A agent.

## Install

```bash
npm install
```

## Build the Renderer

```bash
npm run build
```

## Use the Renderer

```ts
import {MessageProcessor} from '@a2ui/web_core/v0_9';
import {A2uiSurface, basicCatalog, provideMarkdownRenderer} from '@hi-bjhuang/a2ui-vue';
```

## Explorer Demo

The explorer provides three views:

- `All components`: renders every loaded basic catalog example.
- `Focused`: steps through one example message by message and shows the data model.
- `Chat`: sends messages to an A2A agent and renders returned text or A2UI surfaces.

### Prerequisites

- Node.js 18 or newer.
- Clone the A2UI reference repository from GitHub next to this repository when
  running the explorer locally:

```bash
git clone https://github.com/a2ui-project/a2ui.git
```

GitHub repository: https://github.com/a2ui-project/a2ui

The explorer currently loads example JSON files from:

```ts
../../../a2ui/specification/v0_9/catalogs/basic/examples/*.json
```

If you upload the explorer without the sibling `a2ui` repository, copy those
example JSON files into the deployment package and update
`a2ui_explorer/src/examples.ts` accordingly.

### Run Locally

```bash
cd a2ui_explorer
npm install
npm run dev
```

Open:

```text
http://localhost:5180
```

The dev server port is configured in `a2ui_explorer/vite.config.ts`.

### Build for Upload

```bash
cd a2ui_explorer
npm install
npm run build
```

The static output is generated in:

```text
a2ui_explorer/dist
```

Upload the contents of that directory to any static hosting service.

## Agent Chat Configuration

The explorer frontend does not contain a model API key. It only connects to an
A2A agent URL.

Default agent URL:

```ts
http://localhost:10002
```

Configured in:

- `a2ui_explorer/src/App.vue`
- `a2ui_explorer/src/client.ts`

The chat client reads the agent card from:

```text
http://localhost:10002/.well-known/agent-card.json
```

Model keys are configured in the agent service, not in this Vue project. For the
A2UI restaurant finder sample, the key is read from the sample agent `.env`
file:

```text
samples/agent/adk/restaurant_finder/.env
```

Sample source:
https://github.com/a2ui-project/a2ui/tree/main/samples/agent/adk/restaurant_finder

Common variables used by that agent include:

```env
MODEL_NAME=...
GEMINI_API_KEY=...
ANTHROPIC_API_KEY=...
DEEPSEEK_API_KEY=...
LITELLM_MODEL=...
```

Only the variables required by the selected model/provider need to be present.

## Deployment Notes

- The explorer is a pure frontend app after `npm run build`.
- The `Chat` view requires a reachable A2A agent. For a public deployment,
  replace `localhost:10002` with the deployed agent URL or let users enter the
  URL in the `Agent URL` field.
- Ensure the agent allows CORS from the deployed frontend origin.
- Do not place model provider API keys in the frontend. Keep them in the agent
  service environment.

## Troubleshooting

If examples are missing, verify the sibling `a2ui` repository path or update
`a2ui_explorer/src/examples.ts` to point to bundled example files.

If chat fails, check that the agent is running and that this URL returns JSON:

```bash
curl http://localhost:10002/.well-known/agent-card.json
```

If the browser reports CORS errors, update the agent server CORS allowlist to
include the explorer origin.
