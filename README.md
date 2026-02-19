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
