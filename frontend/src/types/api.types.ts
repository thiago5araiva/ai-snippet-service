export interface CreateSnippetRequest {
  text: string
}

export interface SnippetResponse {
  id: string
  text: string
  summary: string
  createdAt: string
  updatedAt: string
}

export interface ApiError {
  error: string
}
