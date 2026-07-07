import { describe, it, expect } from 'vitest';
import app from '../../src';

describe('POST /auth/login', () => {
    it('should return 400 - Missing body', async () => {
        const response = await app.request('/auth/login', { method: 'POST' })
        expect(response.status).toBe(400)
    })

    it('should return 400 - Invalid JSON body', async () => {
        const response = await app.request('/auth/login', {
            method: 'POST',
            body: 'invalid-json',
        })
        expect(response.status).toBe(400)
    })

    it('should return 400 - Missing credentials', async () => {
        const response = await app.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({}),
        })
        expect(response.status).toBe(400)
    })

    it('should return 400 - Missing email', async () => {
        const response = await app.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ password: 'password' }),
        })
        expect(response.status).toBe(400)
    })

    it('should return 400 - Missing password', async () => {
        const response = await app.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ usernameOrEmail: 'test1@test.com' }),
        })
        expect(response.status).toBe(400)
    })

    it('should return 401 - Invalid credentials', async () => {
        const response = await app.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ usernameOrEmail: 'test1@test.com', password: 'wrongpassword' }),
        })
        expect(response.status).toBe(401)
    })

    it('should return 200 - Successful login', async () => {
        const response = await app.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ usernameOrEmail: 'test1@test.com', password: 'password' }),
        })
        expect(response.status).toBe(200)
    })

    it('should return ')
})