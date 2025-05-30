/// <reference types="vite/client" />

export const API_BASE_URL =
  `${import.meta.env.REACT_APP_API_URL}` || 'http://localhost:3000'

export const API_ENDPOINTS = {
  CREATE_SNIPPET: '/snippets',
  GET_SNIPPET: (id: string) => `/snippets/${id}`,
} as const
