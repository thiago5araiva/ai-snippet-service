import { describe, expect, it } from '@jest/globals'
import request from 'supertest'
import app from '../app'

describe('Basic App Tests', () => {
  it('should respond to health check', async () => {
    const response = await request(app).get('/health').expect(200)
    expect(response.body.status).toBe('OK')
  })
})
