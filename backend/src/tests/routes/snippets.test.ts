import request from 'supertest'
import mongoose from 'mongoose'
import app from '../../app'
import { Snippet } from '../../models/snippet.model'
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'

jest.mock('../../services/ai.service', () => ({
  AIService: jest.fn().mockImplementation(() => ({
    generateSummary:
      jest.fn().mockResolvedValue[
        'This is a mocked AI summary for testing purposes.'
      ],
  })),
}))

describe('POST /snippets', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/test-snippets')
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
  })

  afterEach(async () => {
    await Snippet.deleteMany({})
    jest.clearAllMocks()
  })

  it('should create a snippet with summary', async () => {
    const textContent =
      'This is a test text that should be summarized by the AI service for testing purposes.'

    const response = await request(app)
      .post('/snippets')
      .send({ text: textContent })
      .expect(201)

    expect(response.body).toHaveProperty('id')
    expect(response.body.text).toBe(textContent)
    expect(response.body.summary).toBe(
      'This is a mocked AI summary for testing purposes.'
    )
    expect(response.body).toHaveProperty('createdAt')
    expect(response.body).toHaveProperty('updatedAt')

    // Verify it was saved to database
    const savedSnippet = await Snippet.findById(response.body.id)
    expect(savedSnippet).toBeTruthy()
    expect(savedSnippet?.text).toBe(textContent)
  })

  it('should return 400 for missing text', async () => {
    const response = await request(app).post('/snippets').send({}).expect(400)

    expect(response.body.error).toContain('Text is required')
  })

  it('should return 400 for empty text', async () => {
    const response = await request(app)
      .post('/snippets')
      .send({ text: '' })
      .expect(400)

    expect(response.body.error).toContain('Text cannot be empty')
  })

  it('should return 400 for non-string text', async () => {
    const response = await request(app)
      .post('/snippets')
      .send({ text: 123 })
      .expect(400)

    expect(response.body.error).toContain('Text must be a string')
  })

  it('should handle AI service errors', async () => {
    const { AIService } = require('../../services/ai.service')
    const mockAIService = new AIService()
    mockAIService.generateSummary.mockRejectedValue(new Error('AI API Error'))

    const response = await request(app)
      .post('/snippets')
      .send({ text: 'Test text' })
      .expect(500)

    expect(response.body.error).toContain('Failed to generate summary')
  })
})
