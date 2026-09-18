import { APIRequestContext, request } from '@playwright/test';

/**
 * API Client wrapper for Playwright Request Context
 * Provides reusable methods for HTTP operations with built-in error handling
 */
export class ApiClient {
    private requestContext: APIRequestContext | null = null;
    private baseURL: string;
    private defaultHeaders: Record<string, string>;

    constructor(baseURL: string, headers: Record<string, string> = {}) {
        this.baseURL = baseURL;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...headers,
        };
    }

    /**
     * Initialize the API request context
     */
    async init(): Promise<void> {
        this.requestContext = await request.newContext({
            baseURL: this.baseURL,
            extraHTTPHeaders: this.defaultHeaders,
        });
    }

    /**
     * Dispose of the request context
     */
    async dispose(): Promise<void> {
        if (this.requestContext) {
            await this.requestContext.dispose();
        }
    }

    /**
     * GET request
     */
    async get(endpoint: string, options: { params?: Record<string, any>, headers?: Record<string, string> } = {}) {
        if (!this.requestContext) {
            throw new Error('API Client not initialized. Call init() first.');
        }

        const response = await this.requestContext.get(endpoint, {
            params: options.params,
            headers: { ...this.defaultHeaders, ...options.headers },
        });

        return {
            status: response.status(),
            statusText: response.statusText(),
            headers: response.headers(),
            body: await this.parseResponse(response),
            ok: response.ok(),
        };
    }

    /**
     * POST request
     */
    async post(endpoint: string, data: any, options: { headers?: Record<string, string> } = {}) {
        if (!this.requestContext) {
            throw new Error('API Client not initialized. Call init() first.');
        }

        const response = await this.requestContext.post(endpoint, {
            data,
            headers: { ...this.defaultHeaders, ...options.headers },
        });

        return {
            status: response.status(),
            statusText: response.statusText(),
            headers: response.headers(),
            body: await this.parseResponse(response),
            ok: response.ok(),
        };
    }

    /**
     * PUT request
     */
    async put(endpoint: string, data: any, options: { headers?: Record<string, string> } = {}) {
        if (!this.requestContext) {
            throw new Error('API Client not initialized. Call init() first.');
        }

        const response = await this.requestContext.put(endpoint, {
            data,
            headers: { ...this.defaultHeaders, ...options.headers },
        });

        return {
            status: response.status(),
            statusText: response.statusText(),
            headers: response.headers(),
            body: await this.parseResponse(response),
            ok: response.ok(),
        };
    }

    /**
     * PATCH request
     */
    async patch(endpoint: string, data: any, options: { headers?: Record<string, string> } = {}) {
        if (!this.requestContext) {
            throw new Error('API Client not initialized. Call init() first.');
        }

        const response = await this.requestContext.patch(endpoint, {
            data,
            headers: { ...this.defaultHeaders, ...options.headers },
        });

        return {
            status: response.status(),
            statusText: response.statusText(),
            headers: response.headers(),
            body: await this.parseResponse(response),
            ok: response.ok(),
        };
    }

    /**
     * DELETE request
     */
    async delete(endpoint: string, options: { headers?: Record<string, string> } = {}) {
        if (!this.requestContext) {
            throw new Error('API Client not initialized. Call init() first.');
        }

        const response = await this.requestContext.delete(endpoint, {
            headers: { ...this.defaultHeaders, ...options.headers },
        });

        return {
            status: response.status(),
            statusText: response.statusText(),
            headers: response.headers(),
            body: await this.parseResponse(response),
            ok: response.ok(),
        };
    }

    /**
     * Parse response body based on content type
     */
    private async parseResponse(response: any): Promise<any> {
        const contentType = response.headers()['content-type'] || '';

        if (contentType.includes('application/json')) {
            try {
                return await response.json();
            } catch (error) {
                return await response.text();
            }
        }

        return await response.text();
    }

    /**
     * Set authentication token
     */
    setAuthToken(token: string): void {
        this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    /**
     * Remove authentication token
     */
    removeAuthToken(): void {
        delete this.defaultHeaders['Authorization'];
    }
}
