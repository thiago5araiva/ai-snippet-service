import React, { useState } from 'react'
import { SnippetResponse } from '../types/api.types'

interface SnippetDisplayProps {
  snippet: SnippetResponse
  onClose?: () => void
}

const SnippetDisplay: React.FC<SnippetDisplayProps> = ({
  snippet,
  onClose,
}) => {
  const [copied, setCopied] = useState<'text' | 'summary' | null>(null)

  const handleCopy = async (content: string, type: 'text' | 'summary') => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const CopyButton: React.FC<{ onClick: () => void; copied: boolean }> = ({
    onClick,
    copied,
  }) => (
    <button
      onClick={onClick}
      className={`ml-2 px-2 py-1 text-xs rounded transition-colors ${
        copied
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-medium text-gray-900">Generated Summary</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Summary Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">AI Summary</h3>
            <CopyButton
              onClick={() => handleCopy(snippet.summary, 'summary')}
              copied={copied === 'summary'}
            />
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-gray-800 font-medium">{snippet.summary}</p>
          </div>
        </div>

        {/* Original Text Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Original Text</h3>
            <CopyButton
              onClick={() => handleCopy(snippet.text, 'text')}
              copied={copied === 'text'}
            />
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 max-h-60 overflow-y-auto">
            <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
              {snippet.text}
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className="border-t pt-4">
          <div className="flex justify-between text-xs text-gray-500">
            <span>ID: {snippet.id}</span>
            <span>Created: {formatDate(snippet.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SnippetDisplay
