# 🐾 TinyCats — AI-Powered Cat Breed Recommendation Platform

TinyCats is a modern web application designed to help users find the perfect cat breed for their household. Powered by Google Gemini AI and structured breed data delivered via the Model Context Protocol (MCP), it provides personalized recommendations through an onboarding wizard and an interactive chat interface.

---

## 📂 Project Architecture

The repository is organized into three main components:

```
Tiny-Cats/
├── Backend/
│   └── mcp-server/         # Node.js + Express MCP server hosting breed tools
├── tinycats/               # React + TypeScript + Vite frontend client
└── md/                     # Specifications, specifications (PRD, tech spec, schemas)
```

- **Frontend (`tinycats/`):** Built with React 19, TypeScript, Redux Toolkit, Tailwind CSS, and shadcn/ui. Connects to the local MCP server at runtime to fetch and search breed data.
- **Backend (`Backend/mcp-server/`):** Express HTTP server exposing tools to retrieve the breed catalog (21 breeds seeded), get detailed breed profiles, and search breeds based on size, coat length, friendliness, and tags.
- **Specifications (`md/`):** Contains the product requirements, design guidelines, data schemas, and technical specs.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- `pnpm` (recommended package manager)

---

### 1. Set Up and Run the MCP Server

The MCP server runs on port `3001` and serves breed data over Server-Sent Events (SSE).

1. Navigate to the backend directory:
   ```bash
   cd Backend/mcp-server
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the server in development mode:
   ```bash
   npx tsx watch src/index.ts
   ```

To verify the server is running, check the health endpoint at:
`GET http://localhost:3001/health`

---

### 2. Set Up and Run the Frontend Client

The frontend client connects to the MCP server and Google Gemini.

1. Navigate to the frontend directory:
   ```bash
   cd tinycats
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create a `.env` file in the root of the `tinycats` directory:
   ```env
   VITE_GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY
   VITE_MCP_SERVER_URL=http://localhost:3001/mcp
   VITE_APP_ENV=development
   ```
4. Start the Vite development server:
   ```bash
   pnpm run dev
   ```
5. Open your browser and navigate to:
   [http://localhost:5173](http://localhost:5173)

---

## 🔌 Model Context Protocol (MCP) Tools

The MCP server registers the following tools for structured breed retrieval:

| Tool Name | Parameters | Description |
|---|---|---|
| `get_breed_list` | `{}` | Returns the full list of all 21 seeded cat breeds. |
| `get_breed_detail` | `{ breedId: string }` | Returns the detailed profile of a specific breed. |
| `search_breeds` | `{ filters?: BreedFilters, limit?: number }` | Filters breeds based on tags, size, coat length, and traits. |

---

## 🧩 Features Implemented

- **Onboarding Quiz:** A 7-step wizard matching user lifestyle (space, activity, allergy, experience) with breeds.
- **AI Recommendation Engine:** Streams matching scores and summaries directly from Google Gemini.
- **Interactive Chat Panel:** Converse with a Gemini-powered cat expert injected with your quiz recommendations context.
- **Breed Catalog & Filters:** Browse all 21 breeds with real-time in-memory filtering.
- **Compare & Save:** Compare up to 3 breeds side-by-side; save favorites to local storage.
