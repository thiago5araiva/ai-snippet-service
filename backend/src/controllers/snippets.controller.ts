import { Request, Response } from 'express'
import { Snippet } from '../models/snippet.model'
import { AIService } from '../services/ai.service'
import { CreateSnippetRequest, SnippetResponse } from '../types/snippet.types'
import mongoose from 'mongoose'

export class SnippetsController {
  private aiService: AIService
  constructor() {
    this.aiService = new AIService()
  }

  async createSnippet(
    req: Request<{}, SnippetResponse, CreateSnippetRequest>,
    res: Response
  ): Promise<void> {
    try {
      const { text } = req.body

      if (!text) {
        res.status(400).json({ error: 'Text is required' })
        return
      }

      if (typeof text !== 'string') {
        res.status(400).json({ error: 'Text must be a string' })
        return
      }

      if (text.trim().length === 0) {
        res.status(400).json({ error: 'Text cannot be empty' })
        return
      }

      if (text.length > 50000) {
        res.status(400).json({ error: 'Text too long (max 50000 characters)' })
        return
      }

      const summary = await this.aiService.generateSummary(text)

      const snippet = new Snippet({
        text: text.trim(),
        summary,
      })

      const savedSnippet = await snippet.save()

      res.status(201).json({
        id: savedSnippet.id,
        text: savedSnippet.text,
        summary: savedSnippet.summary,
        createdAt: savedSnippet.createdAt,
        updatedAt: savedSnippet.updatedAt,
      })
    } catch (error) {
      console.error('Error creating snippet:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  async getSnippet(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid snippet ID' })
        return
      }

      const snippet = await Snippet.findById(id)

      if (!snippet) {
        res.status(404).json({ error: 'Snippet not found' })
        return
      }

      res.json({
        id: snippet.id,
        text: snippet.text,
        summary: snippet.summary,
        createdAt: snippet.createdAt,
        updatedAt: snippet.updatedAt,
      })
    } catch (error) {
      console.error('Error fetching snippet:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}
