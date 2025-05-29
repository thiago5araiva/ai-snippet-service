import React, { useState, useEffect } from 'react'
import SnippetCreator from './components/SnippetCreator'
import SnippetDisplay from './components/SnippetDisplay'
import { SnippetResponse } from './types/api.types'
import { apiService } from './services/api.service'
import './index.css'

interface AppState {
  currentSnippet: SnippetResponse | null
  snippetHistory: SnippetResponse[]
  backendStatus: 'checking' | 'online' | 'offline'
}

function App() {
  const [state, setState] = useState<AppState>({
    currentSnippet: null,
    snippetHistory: [],
    backendStatus: 'checking',
  })

  // Check backend health on app load
  useEffect(() => {
    checkBackendHealth()
  }, [])

  const checkBackendHealth = async () => {
    try {
      await apiService.healthCheck()
      setState((prev) => ({ ...prev, backendStatus: 'online' }))
    } catch (error) {
      setState((prev) => ({ ...prev, backendStatus: 'offline' }))
    }
  }

  const handleSnippetCreated = (snippet: SnippetResponse) => {
    setState((prev) => ({
      ...prev,
      currentSnippet: snippet,
      snippetHistory: [snippet, ...prev.snippetHistory.slice(0, 9)], // Keep last 10
    }))
  }

  const handleCloseSnippet = () => {
    setState((prev) => ({ ...prev, currentSnippet: null }))
  }

  const handleSelectFromHistory = (snippet: SnippetResponse) => {
    setState((prev) => ({ ...prev, currentSnippet: snippet }))
  }

  const handleRetryConnection = () => {
    setState((prev) => ({ ...prev, backendStatus: 'checking' }))
    checkBackendHealth()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              AI Snippet Service
            </h1>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Backend Online</span>
            </div>
          </div>
          <p className="mt-2 text-gray-600">
            Paste your text and get AI-generated summaries in seconds
          </p>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SnippetCreator onSnippetCreated={handleSnippetCreated} />
          </div>
          <div className="lg:col-span-1">
            {state.snippetHistory.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Recent Snippets
                </h3>
                <div className="space-y-2">
                  {state.snippetHistory.map((snippet) => (
                    <button
                      key={snippet.id}
                      onClick={() => handleSelectFromHistory(snippet)}
                      className="w-full text-left p-2 text-xs bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                      <div className="font-medium text-gray-900 truncate">
                        {snippet.summary}
                      </div>
                      <div className="text-gray-500 mt-1">
                        {new Date(snippet.createdAt).toLocaleString()}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {state.currentSnippet && (
          <div className="mt-6">
            <SnippetDisplay
              snippet={state.currentSnippet}
              onClose={handleCloseSnippet}
            />
          </div>
        )}
      </main>
      <footer className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-500">
            AI Snippet Service - Tech Challenge Implementation
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
