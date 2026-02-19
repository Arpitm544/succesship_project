import MemoryManager from './components/MemoryManager'
import QueryInterface from './components/QueryInterface'

function App() {
  return (
    <div className="h-screen">
      <div className="min-h-0 p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MemoryManager />  
        <QueryInterface />
      </div>
    </div>
  )
}

export default App
