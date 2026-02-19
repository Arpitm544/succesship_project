# Documentation — Context & Memory Management System

## What is this project?

This is an AI-powered business context agent. The idea is simple — businesses deal with a lot of entities like suppliers, customers, and internal teams. Every interaction generates context (e.g., "Supplier XYZ sent a bad batch", "Customer ABC paid their invoice late"). Over time, it becomes hard to remember everything.

So this system lets you:
1. **Store business memories** — Log interactions, quality issues, payments, contracts, etc.
2. **Ask questions to an AI agent** — The agent looks at your stored memories, picks the most relevant ones, and uses Google Gemini to give you a decision with reasoning.

For example, you can ask *"Should we renew the contract with Supplier XYZ?"* and the agent will pull up past issues with that supplier and give you an informed recommendation.

---

## Tech Stack

**Backend:**
- Node.js with Express — handles the API
- MongoDB with Mongoose — stores the memories
- Google Gemini (via `@google/generative-ai`) — the AI brain
- dotenv, cors, body-parser — standard middleware

**Frontend:**
- React 19 (with Vite as the bundler)
- Tailwind CSS 4 — for styling
- Axios — for making API calls

---

## How it works (high level)

The app has two main flows:

### Flow 1 — Saving a memory

User fills the form on the left panel → clicks "Save Memory" → frontend sends a `POST` request to the backend → backend saves it to MongoDB → the memory list refreshes.

### Flow 2 — Asking the agent

User types a question on the right panel → clicks "Ask" → frontend sends a `POST` request to `/api/query` → backend fetches all memories from the database → filters the ones that match the query keywords → picks the top 5 → sends them along with the question to Google Gemini → Gemini returns a JSON with its decision and reason → backend sends that back to the frontend → frontend displays the answer and the context it used.

---

## Backend

The backend follows a simple MVC-like structure with `models/`, `routes/`, and `services/` folders.

### server.js

This is the entry point. It does 4 things:
1. Loads environment variables from `.env`
2. Sets up Express with CORS and JSON parsing
3. Connects to MongoDB
4. Mounts the API routes on `/api` and starts the server on port 5000

```js
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const apiRoutes = require('./routes/api')

const app = express()
app.use(cors())
app.use(bodyParser.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('DB Connected'))
  .catch(err => console.log(err))

app.use('/api', apiRoutes)

app.listen(5000, () => {
  console.log("Server started on 5000")
})
```

---

### models/Memory.js

This defines what a "memory" looks like in the database. Each memory has:

- **entity** (required) — who is this about? e.g., "Supplier XYZ"
- **entityType** — one of `supplier`, `customer`, or `internal`
- **memoryType** — what kind of event: `interaction`, `quality_issue`, `payment`, `contract`, or `escalation`
- **content** (required) — what actually happened, in plain text
- **timestamp** — auto-set to when the memory was created
- **importance** — a number from 0 to 1 (default 0.5)
- **tags** — optional array of tags like `["urgent", "follow-up"]`

Example of how a document looks in MongoDB:
```json
{
  "entity": "Supplier XYZ",
  "entityType": "supplier",
  "memoryType": "quality_issue",
  "content": "Supplier XYZ delivered a bad batch of components",
  "importance": 0.8,
  "tags": ["urgent", "quality"],
  "timestamp": "2025-06-01T10:30:00.000Z"
}
```

---

### routes/api.js

This file has 3 API endpoints:

**1. `POST /api/memories`** — Save a new memory

Takes the request body and creates a document in MongoDB using `Memory.create()`. Returns the saved document.

**2. `GET /api/memories`** — Get all memories

Simply does `Memory.find()` and returns everything. No pagination or filters — keeps it simple.

**3. `POST /api/query`** — Ask the AI agent

This is the core logic:
- Takes a `query` string from the request body
- Fetches all memories from the database
- Filters them by checking if the memory's `content` includes the query keyword (case-insensitive)
- Takes the top 5 matches
- Passes them to `geminiService.askGemini()` along with the question
- Returns the AI's response + the context memories it used

```js
router.post('/query', async (req, res) => {
  const { query, entity } = req.body
  const result = await Memory.find()

  const bestMemories = result
    .filter((m) => m.content.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5)

  const aiAnswer = await geminiService.askGemini(query, bestMemories)

  res.json({
    decision: aiAnswer,
    context: bestMemories
  })
})
```

---

### services/geminiService.js

This handles the AI part. It uses the `@google/generative-ai` package to talk to Google Gemini.

The `askGemini()` function:
1. Takes the user's question and the relevant memories
2. Formats the memories into a readable history string
3. Builds a prompt telling Gemini to act as a business assistant and respond in JSON
4. Calls the API and parses the response
5. If anything fails, returns a safe fallback error response

The prompt looks like this:
```
You are a helpful business assistant.

Question: Should we renew the contract with Supplier XYZ?

History:
Supplier XYZ delivered a bad batch (2025-06-01)
Supplier XYZ missed delivery deadline (2025-05-15)

Reply only in JSON:
{ "decision": "...", "reason": "..." }
```

---

## Frontend

The frontend is a React app built with Vite. It has just 2 main components.

### App.jsx

The root component. It renders a two-column layout — `MemoryManager` on the left and `QueryInterface` on the right. On smaller screens, they stack vertically.

---

### MemoryManager.jsx

This is the bigger component (~200 lines). It handles two things:

**1. The form** — Has inputs for entity name, entity type (dropdown), memory type (dropdown), importance (number), content (textarea), and tags (comma-separated text). When you submit, it sends a POST request to save the memory, resets the form, and refreshes the list.

**2. The memory list** — Shows all saved memories as cards. Each card shows:
- Entity name and type
- A colored badge for the memory type (red for escalation, orange for quality issues, blue for everything else)
- The content
- Importance score, date, and tags

The component fetches all memories on mount using `useEffect` and `axios.get()`.

---

### QueryInterface.jsx

This is the question-answering panel (~100 lines).

- Has a text input where you type your question and an "Ask" button
- When you ask, it sends the query to `/api/query` and displays the result
- The result shows two things:
  - **AI Answer** — The decision and reasoning from Gemini
  - **Context Used** — The memories that the AI used to make its decision
- When no query has been made yet, it shows a simple empty state: "No queries yet"

---

## API Endpoints Summary

| Endpoint | Method | What it does |
|----------|--------|-------------|
| `/api/memories` | `POST` | Save a new memory |
| `/api/memories` | `GET` | Get all saved memories |
| `/api/query` | `POST` | Ask the AI agent a question |

---

## Environment Setup

You need a `.env` file in the `backend/` folder with these:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/business_memory
GEMINI_API_KEY=your_gemini_api_key_here
```

- `MONGO_URI` — Your MongoDB connection string (local or Atlas)
- `GEMINI_API_KEY` — Get it from [Google AI Studio](https://aistudio.google.com/apikey)

---

## How to Run

**Backend:**
```bash
cd agent/backend
npm install
npm start
```
Server starts on http://localhost:5000

**Frontend:**
```bash
cd agent/frontend
npm install
npm run dev
```
App opens on http://localhost:5173

---

## What I learned

- How to structure a Node.js backend with separate folders for models, routes, and services
- How to define Mongoose schemas with validation (enums, required fields, default values)
- How to integrate Google Gemini API for AI-powered features
- How to build a React frontend with Vite and connect it to a REST API using Axios
- How to use Tailwind CSS for quick and responsive UI design
- How prompt engineering works — crafting the right prompt to get structured JSON responses from an LLM
