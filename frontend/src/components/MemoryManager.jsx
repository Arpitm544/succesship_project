import { useState, useEffect } from "react"
import axios from "axios"

const MemoryManager = () => {
  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    entity: "",
    entityType: "supplier",
    memoryType: "interaction",
    content: "",
    importance: 0.5,
    tags: ""
  })

  const fetchMemories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/memories`)
      setMemories(res.data)
    } catch (err) {
      console.log("Fetch error:", err)
    }
  }

  useEffect(() => {
    fetchMemories()
  }, [])

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/memories`, {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      })

      setFormData({
        entity: "",
        entityType: "supplier",
        memoryType: "interaction",
        content: "",
        importance: 0.5,
        tags: ""
      })

      fetchMemories()
    } catch (err) {
      console.log("Save error:", err)
    }

    setLoading(false)
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">

      <h2 className="text-xl font-semibold mb-4">
        Add Memory
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">

        <input
          type="text"
          name="entity"
          value={formData.entity}
          onChange={handleChange}
          placeholder="Entity name"
          required
          className="w-full p-2 border rounded"
        />

        <select
          name="entityType"
          value={formData.entityType}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="supplier">Supplier</option>
          <option value="customer">Customer</option>
          <option value="internal">Internal</option>
        </select>

        <select
          name="memoryType"
          value={formData.memoryType}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="interaction">Interaction</option>
          <option value="quality_issue">Quality Issue</option>
          <option value="payment">Payment</option>
          <option value="contract">Contract</option>
          <option value="escalation">Escalation</option>
        </select>

        <input
          type="number"
          name="importance"
          value={formData.importance}
          onChange={handleChange}
          min="0"
          max="1"
          step="0.1"
          className="w-full p-2 border rounded"
        />

        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Write what happened..."
          required
          rows="3"
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="urgent, follow-up"
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Saving..." : "Save Memory"}
        </button>
      </form>

      <h3 className="text-lg font-semibold mt-6 mb-2">
        Recent Memories
      </h3>

      <div className="space-y-2 max-h-64 overflow-y-auto">

        {memories.map((m) => (
          <div key={m._id} className="p-3 border rounded">

            <div className="flex justify-between">
              <p className="font-medium">
                {m.entity} ({m.entityType})
              </p>
              <span className="text-sm text-gray-500">
                {m.memoryType}
              </span>
            </div>

            <p className="text-sm mt-1">{m.content}</p>

            <p className="text-xs text-gray-500 mt-2">
              Importance: {m.importance} •{" "}
              {new Date(m.timestamp).toLocaleDateString()}
            </p>

            {m.tags?.length > 0 && (
              <p className="text-xs text-gray-600 mt-1">
                {m.tags.map((t,i) => (
                  <span key={i}>{t} </span>
                ))}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MemoryManager
