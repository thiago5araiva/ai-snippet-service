import mongoose from 'mongoose'
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
} from '@jest/globals'
import { Snippet } from '../models/snippet.model'
require('dotenv').config()

describe('Snippet Model', () => {
  beforeAll(async () => {
    await mongoose.connect(`${process.env.MONGODB_URI}`!)
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  afterEach(async () => {
    await Snippet.deleteMany({})
  })

  it('should create a snippet ', async () => {
    const snippetData = {
      text: 'This is a test text for creating a snippet.',
      summary: 'Test text for snippet creation.',
    }
    const snippet = new Snippet(snippetData)
    const savedSnippet = await snippet.save()
    expect(savedSnippet._id).toBeDefined()
    expect(savedSnippet.text).toBe(snippetData.text)
    expect(savedSnippet.summary).toBe(snippetData.summary)
    expect(savedSnippet.createdAt).toBeDefined()
  })
  it('should fail without text field', async () => {
    const snippet = new Snippet({ summary: 'summary' })
    await expect(snippet.save()).rejects.toThrow()
  })
  it('should fail without summary field', async () => {
    const snippet = new Snippet({ text: 'text' })
    await expect(snippet.save()).rejects.toThrow()
  })
  it('should have timestamps', async () => {
    const snippet = new Snippet({
      text: 'Test text',
      summary: 'Test summary',
    })
    const saved = await snippet.save()
    expect(saved.createdAt).toBeInstanceOf(Date)
    expect(saved.updatedAt).toBeInstanceOf(Date)
  })
})
