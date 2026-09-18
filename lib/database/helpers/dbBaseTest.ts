import { test as baseTest } from '@playwright/test';
import { DbClient } from '../clients/dbClient';
import { UserRepository } from '../repositories/userRepository';
import { ProductRepository } from '../repositories/productRepository';
import { OrderRepository } from '../repositories/orderRepository';

/**
 * Database Test Fixtures
 * Extends Playwright test with Repository Layer fixtures (follows POM pattern)
 * Repositories encapsulate database queries, tests use high-level methods
 */

type DbFixtures = {
    // Low-level client (available if needed, but prefer repositories)
    dbClient: DbClient;

    // Repository Layer (use these in tests - like Page Objects for Database)
    userRepository: UserRepository;
    productRepository: ProductRepository;
    orderRepository: OrderRepository;
};

export const dbTest = baseTest.extend<DbFixtures>({
    /**
     * Database client fixture with automatic setup and teardown
     */
    dbClient: async ({}, use) => {
        const client = new DbClient();

        try {
            await client.init();
            console.log('📊 Database client initialized for test');

            // Use the client in the test
            await use(client);
        } catch (error) {
            console.warn('⚠️ Database connection failed, skipping DB tests:', error);
            // Provide a mock client or skip the test
            throw error;
        } finally {
            // Clean up
            await client.close();
            console.log('📊 Database client closed');
        }
    },

    /**
     * User Repository (high-level user database operations)
     */
    userRepository: async ({ dbClient }, use) => {
        const repository = new UserRepository(dbClient);
        await use(repository);
    },

    /**
     * Product Repository (high-level product database operations)
     */
    productRepository: async ({ dbClient }, use) => {
        const repository = new ProductRepository(dbClient);
        await use(repository);
    },

    /**
     * Order Repository (high-level order database operations)
     */
    orderRepository: async ({ dbClient }, use) => {
        const repository = new OrderRepository(dbClient);
        await use(repository);
    },
});

export { expect } from '@playwright/test';
