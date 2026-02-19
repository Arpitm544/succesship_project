import { useState } from "react"
import axios from "axios"

const QueryInterface = () => {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleQuery = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/query`, {
        query,
        entity: "user"
      })

      setResult(res.data)
    } catch (err) {
      console.log("Query error:", err)
    }

    setLoading(false)
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow flex flex-col h-full">

      <h2 className="text-xl font-semibold mb-4">
        Ask Agent
      </h2>

      <form onSubmit={handleQuery} className="flex gap-2 mb-6">

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 p-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-purple-600 text-white rounded"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>

      <div className="flex-1">

        {!result && (
          <p className="text-gray-400 text-center mt-10">
            No queries yet. Ask something.
          </p>
        )}

        {result && (
          <div className="space-y-6">

            <div className="p-4 border rounded">
              <h3 className="font-semibold mb-2">
                AI Answer
              </h3>

              {typeof result.decision === "object" ? (
                <>
                  <p className="font-bold">
                    {result.decision.decision}
                  </p>
                  <p className="text-gray-600">
                    {result.decision.reason}
                  </p>
                </>
              ) : (
                <p>{result.decision}</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                Context Used
              </h3>

              <div className="space-y-3">
                {result.context.map((ctx) => (
                  <div key={ctx._id} className="p-3 border rounded">

                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{ctx.entity}</span>
                      <span className="text-gray-500">
                        {ctx.memoryType}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700">
                      {ctx.content}
                    </p>

                    <p className="text-xs text-gray-500 mt-2">
                      Importance: {ctx.importance} • Relevance:{" "}
                      {(ctx.score * 100).toFixed(0)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default QueryInterface
