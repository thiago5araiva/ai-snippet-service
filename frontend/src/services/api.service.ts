import axios, { AxiosResponse } from 'axios'
import {
  CreateSnippetRequest,
  SnippetResponse,
  ApiError,
} from '../types/api.types'
import { API_BASE_URL, API_ENDPOINTS } from '../config/api.config'

class ApiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  constructor() {
    // Request interceptor for logging
    this.api.interceptors.request.use(
      (config) => {
        console.log(
          `API Request: ${config.method?.toUpperCase()} ${config.url}`
        )
        return config
      },
      (error) => {
        console.error('Request Error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`)
        return response
      },
      (error) => {
        console.error('Response Error:', error.response?.data || error.message)
        return Promise.reject(error)
      }
    )
  }

  async createSnippet(data: CreateSnippetRequest): Promise<SnippetResponse> {
    try {
      const response: AxiosResponse<SnippetResponse> = await this.api.post(
        API_ENDPOINTS.CREATE_SNIPPET,
        data
      )
      return response.data
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error)
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - AI processing took too long')
      }
      throw new Error('Failed to create snippet. Please try again.')
    }
  }

  async getSnippet(id: string): Promise<SnippetResponse> {
    try {
      const response: AxiosResponse<SnippetResponse> = await this.api.get(
        API_ENDPOINTS.GET_SNIPPET(id)
      )
      return response.data
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Snippet not found')
      }
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error)
      }
      throw new Error('Failed to fetch snippet. Please try again.')
    }
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await this.api.get('/health')
      return response.data
    } catch (error) {
      throw new Error('Backend service is not available')
    }
  }
}

export const apiService = new ApiService()
