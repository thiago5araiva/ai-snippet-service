import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'

import { AIService } from '../services/ai.service'
import OpenAI from 'openai'

require('dotenv').config()

jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  })),
}))

describe('AI Service', () => {
  let aiService: AIService
  let mockOpenAI: any

  beforeEach(() => {
    mockOpenAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    aiService = new AIService()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should generate summary under 30 words', async () => {
    const longText =
      'This is a very long text that needs to be summarized. '.repeat(20)
    const expectedSummary =
      'This is a concise summary of the long text provided for testing purposes.'
    mockOpenAI.chat.completions.create.mockResolvedValue({
      choices: [
        {
          message: {
            content: expectedSummary,
          },
        },
      ],
    })
    const result = await aiService.generateSummary(longText)
    expect(result).toBe(expectedSummary)
    expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Summarize the following text in exactly 30 words or less:\n\n${longText}`,
        },
      ],
      max_tokens: 50,
      temperature: 0.3,
    })
  })

  it('should handle API errors gracefully', async () => {
    const text = 'Test text'

    mockOpenAI.chat.completions.create.mockRejectedValue(new Error('API Error'))

    await expect(aiService.generateSummary(text)).rejects.toThrow(
      'Failed to generate summary: API Error'
    )
  })

  it('should handle empty responses', async () => {
    const text = 'Test text'

    mockOpenAI.chat.completions.create.mockResolvedValue({
      choices: [],
    })

    await expect(aiService.generateSummary(text)).rejects.toThrow(
      'No summary generated'
    )
  })

  it('should trim whitespace from summary', async () => {
    const text = 'Test text'
    const summaryWithSpaces = '  Summary with spaces  '

    mockOpenAI.responses?.create.mockResolvedValue({
      model: 'gpt-4.1',
      input: summaryWithSpaces,
    })

    const result = await aiService.generateSummary(summaryWithSpaces)
    expect(result).toBe('Summary with spaces')
  })
})
