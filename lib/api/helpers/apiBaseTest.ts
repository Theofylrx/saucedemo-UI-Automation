import { test as baseTest } from '@playwright/test';
import { ApiClient } from '../clients/apiClient';
import { UserService } from '../services/userService';
import { PostService } from '../services/postService';
import { ProductService } from '../services/productService';
import { OrderService } from '../services/orderService';

/**
 * API Test Fixtures
 * Extends Playwright test with Service Layer fixtures (follows POM pattern)
 * Services encapsulate business logic, tests use high-level methods
 */

type ApiFixtures = {
    // Low-level clients (available if needed, but prefer services)
    apiClient: ApiClient;
    mockApiClient: ApiClient;

    // Service Layer (use these in tests - like Page Objects for APIs)
    userService: UserService;
    postService: PostService;
    productService: ProductService;
    orderService: OrderService;
};

export const apiTest = baseTest.extend<ApiFixtures>({
    /**
     * Public API Client (JSONPlaceholder for demo)
     */
    apiClient: async ({}, use) => {
        const client = new ApiClient('https://jsonplaceholder.typicode.com');
        await client.init();
        await use(client);
        await client.dispose();
    },

    /**
     * Mock API Client (local json-server or Docker container)
     * Falls back to JSONPlaceholder if mock server is not available
     */
    mockApiClient: async ({}, use) => {
        // Try Docker container first, fallback to localhost, then JSONPlaceholder
        const baseURLs = [
            'http://mock-api:3000',           // Docker container
            'http://localhost:3000',          // Local json-server
            'https://jsonplaceholder.typicode.com', // Fallback
        ];

        let client: ApiClient | null = null;

        for (const baseURL of baseURLs) {
            try {
                client = new ApiClient(baseURL);
                await client.init();

                // Test connection
                const testResponse = await client.get('/users');
                if (testResponse.ok) {
                    break; // Successfully connected
                }
            } catch (error) {
                // Try next URL
                if (client) {
                    await client.dispose();
                    client = null;
                }
            }
        }

        if (!client) {
            throw new Error('Unable to connect to any API endpoint');
        }

        await use(client);
        await client.dispose();
    },

    /**
     * User Service (high-level user operations)
     */
    userService: async ({ apiClient }, use) => {
        const service = new UserService(apiClient);
        await use(service);
    },

    /**
     * Post Service (high-level post operations)
     */
    postService: async ({ apiClient }, use) => {
        const service = new PostService(apiClient);
        await use(service);
    },

    /**
     * Product Service (high-level product operations - mock API)
     */
    productService: async ({ mockApiClient }, use) => {
        const service = new ProductService(mockApiClient);
        await use(service);
    },

    /**
     * Order Service (high-level order operations - mock API)
     */
    orderService: async ({ mockApiClient }, use) => {
        const service = new OrderService(mockApiClient);
        await use(service);
    },
});

export { expect } from '@playwright/test';
