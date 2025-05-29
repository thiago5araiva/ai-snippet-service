import React, { useState } from 'react'
import { apiService } from '../services/api.service'
import { SnippetResponse } from '../types/api.types'

interface SnippetCreatorProps {
  onSnippetCreated: (snippet: SnippetResponse) => void
}

const SnippetCreator: React.FC<SnippetCreatorProps> = ({
  onSnippetCreated,
}) => {
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!text.trim()) {
      setError('Please enter some text to summarize')
      return
    }

    if (text.length > 50000) {
      setError('Text is too long (maximum 50,000 characters)')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const snippet = await apiService.createSnippet({ text: text.trim() })
      onSnippetCreated(snippet)
      setText('') // Clear form after success
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setText('')
    setError(null)
  }

  const handleRetry = () => {
    setError(null)
    handleSubmit(new Event('submit') as any)
  }

  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length
  const charCount = text.length

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Create AI Summary
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="text"
            className="block text-sm font-medium text-gray-700 mb-2">
            Text to Summarize
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here (blog drafts, transcripts, articles, etc.)..."
            disabled={isLoading}
            className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            style={{ resize: 'vertical', minHeight: '160px' }}
          />
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>
              {wordCount} words, {charCount} characters
            </span>
            <span className={charCount > 45000 ? 'text-red-500' : ''}>
              {charCount > 45000
                ? 'Approaching limit'
                : `${50000 - charCount} remaining`}
            </span>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={isLoading || !text.trim() || charCount > 50000}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
            {isLoading ? 'Generating Summary...' : 'Generate Summary'}
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-50 disabled:cursor-not-allowed">
            Clear
          </button>
        </div>
      </form>
    </div>
  )
}

export default SnippetCreator
