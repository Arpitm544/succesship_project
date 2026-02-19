# Context and Memory Management System

A prototype AI agent system that maintains business context, retrieved via a ranking algorithm, and uses Google Gemini to reason and explain decisions.

## Project Structure
- **backend/**: Node.js, Express, MongoDB, Google Gemini integration.
- **frontend/**: React (Vite), Business Dashboard UI.

## Prerequisites
- Node.js (v18+)
- MongoDB (running locally or remote URI)
- Google Gemini API Key

## Setup & Run

### 1. Configure Backend
1. Navigate to backend: `cd business-context-agent/backend`
2. Create/Edit `.env` file:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/business_memory
   GEMINI_API_KEY=your_actual_gemini_key_here
   ```
   *(Note: A template `.env` is provided. Please update the API KEY)*
3. Install dependencies (if not done): `npm install`
4. Start Server: `npm start` (Runs on port 5000)

### 2. Configure Frontend
1. Navigate to frontend: `cd business-context-agent/frontend`
2. Install dependencies (if not done): `npm install`
3. Start Dev Server: `npm run dev`
4. Open the link provided (usually `http://localhost:5173`)

## Usage Guide
1. **Add Context**: Use the "Add Business Context" form to log interactions (e.g., "Supplier XYZ delivered bad batch", "Customer ABC paid invoice").
2. **View Context**: See the "Recent Context" list updating.
3. **Ask Agent**: Use the "Agent Reasoning Engine" panel.
   - Enter a query: "Should we fast-track Supplier XYZ?"
   - (Optional) Enter Entity: "Supplier XYZ" to filter context.
   - Click "Ask Agent".
4. **Review**: See the **Decision**, **Reasoning**, and the specific **Retrieved Memories** that influenced the AI.

## Technical Details
- **Memory Ranking**: Uses a weighted score of Semantic Relevance (keyword match), Recency (decay over time), Entity Match, and Importance.
- **AI**: Gemini 1.5 Flash for fast reasoning.
- **Storage**: MongoDB for scalable memory persistence.

## System Capabilities & Design Philosophy (Q&A)

### 1. How would your system scale to thousands of suppliers, millions of transactions?
To scale, the system should use:
- **Database indexing** on entity names, timestamps, and importance
- **Vector search** + metadata filtering for fast retrieval
- **Store only top-ranked memories** instead of loading everything
- **Archive old/stale data** into cheaper storage
- **Use caching** for frequently accessed entities

This allows efficient retrieval even with large datasets.

### 2. Should emotional context (customer frustration, urgency) be stored and retrieved?
**Yes**, because emotional signals impact business decisions.

Example:
- A frustrated enterprise customer may require faster escalation
- High urgency tickets should be prioritized

Emotional context should be stored as soft metadata (priority level, sentiment score), not as unnecessary personal detail.

### 3. How do you ensure data privacy when storing business-sensitive context?
Privacy can be ensured through:
- **Role-based access control (RBAC)**
- **Encryption** of stored data
- **Masking sensitive fields** (payment info, personal contacts)
- **Logging and audit trails**
- **Keeping only necessary context**, not everything

This reduces risk of leakage.

### 4. Can your system explain why it retrieved specific context for a decision?
**Yes**, explainability is critical.

The agent can show:
- Retrieved memories
- Relevance score breakdown (recency + semantic match + entity match)
- A short reasoning summary like: *"This invoice was flagged because Supplier XYZ had quality issues 4 months ago."*

This builds trust.

### 5. How would you handle multi-agent scenarios where different agents need shared context?
In multi-agent environments:
- Use a **central shared memory store** (MongoDB/vector DB)
- Assign **namespaces or permissions** per department
- Agents **write updates back** into shared memory
- Synchronize context through **event-driven updates**

This ensures consistency across agents.
