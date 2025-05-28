import { type Document } from 'mongoose'
export interface CreateSnippetRequest {
  text: string
}

export interface SnippetResponse {
  id: string
  text: string
  summary: string
  createdAt: Date
  updatedAt: Date
}

export interface ISnippet extends Document {
  text: string
  summary: string
  createdAt: Date
  updatedAt: Date
}
