export const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:3000'

export const API_ENDPOINTS = {
  CREATE_SNIPPET: '/snippets',
  GET_SNIPPET: (id: string) => `/snippets/${id}`,
} as const
