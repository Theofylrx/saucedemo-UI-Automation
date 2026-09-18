import { dbTest as test, expect } from '../../lib/database/helpers/dbBaseTest';
import { OrderStatus } from '../../lib/database/models/dbModels';
import {
    DbUserSchema,
    DbProductSchema,
    DbOrderSchema,
    DbOrderItemSchema,
    safeValidateDbSchema,
} from '../../lib/database/schemas/dbSchemas';

/**
 * Database Integration Tests
 * Uses Repository Layer (like Page Object Model for Database)
 * Tests call high-level business methods instead of raw SQL queries
 */

test.describe('Database Testing - Users', () => {
    test('should verify user exists in database', { tag: '@database' }, async ({ userRepository }) => {
        const user = await userRepository.findByUsername('standard_user');

        expect(user).toBeTruthy();
        expect(user?.username).toBe('standard_user');
        expect(user?.email).toContain('@saucedemo.com');
        expect(user?.first_name).toBeTruthy();
        expect(user?.last_name).toBeTruthy();
    });

    test('should create a new user in database', { tag: '@database' }, async ({ userRepository }) => {
        const newUser = await userRepository.create({
            username: `test_user_${Date.now()}`,
            email: `test${Date.now()}@example.com`,
            first_name: 'Test',
            last_name: 'User',
        });

        expect(newUser.id).toBeDefined();
        expect(newUser.username).toContain('test_user_');
        expect(newUser.created_at).toBeDefined();

        // Cleanup
        await userRepository.deleteById(newUser.id);
    });

    test('should count total users in database', { tag: '@database' }, async ({ userRepository }) => {
        const count = await userRepository.count();
        expect(count).toBeGreaterThanOrEqual(1);
    });

    test('should verify user email format', { tag: '@database' }, async ({ userRepository }) => {
        const usersWithValidEmail = await userRepository.getAllWithValidEmail();

        expect(usersWithValidEmail.length).toBeGreaterThan(0);
        usersWithValidEmail.forEach((user) => {
            expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        });
    });
});

test.describe('Database Testing - Products', () => {
    test('should verify products exist in database', { tag: '@database' }, async ({ productRepository }) => {
        const products = await productRepository.findAll();

        expect(products.length).toBeGreaterThan(0);

        const backpack = await productRepository.findById('sauce-labs-backpack');
        expect(backpack).toBeDefined();
        expect(backpack?.name).toBe('Sauce Labs Backpack');
        expect(parseFloat(backpack?.price as any)).toBe(29.99);
        expect(backpack?.inventory_count).toBeGreaterThanOrEqual(0);
    });

    test('should verify product inventory levels', { tag: '@database' }, async ({ productRepository }) => {
        const lowStockProducts = await productRepository.findLowInventory(10);

        lowStockProducts.forEach((product) => {
            expect(product.inventory_count).toBeGreaterThanOrEqual(0);
            expect(product.inventory_count).toBeLessThan(10);
        });
    });

    test('should calculate total inventory value', { tag: '@database' }, async ({ productRepository }) => {
        const totalValue = await productRepository.getTotalInventoryValue();
        expect(totalValue).toBeGreaterThan(0);
    });
});

test.describe('Database Testing - Orders with Query Helper', () => {
    test('should create and verify order in database', { tag: '@database' }, async ({ orderRepository, userRepository }) => {
        // Get a test user
        const user = await userRepository.findByUsername('standard_user');
        expect(user).toBeTruthy();

        // Create an order
        const orderNumber = `TEST-ORD-${Date.now()}`;
        const order = await orderRepository.create({
            userId: user!.id,
            orderNumber,
            totalAmount: 59.98,
            status: OrderStatus.PENDING,
        });

        expect(order.id).toBeDefined();
        expect(order.order_number).toBe(orderNumber);
        expect(parseFloat(order.total_amount as any)).toBe(59.98);
        expect(order.status).toBe(OrderStatus.PENDING);

        // Add order items
        await orderRepository.addItem({
            orderId: order.id,
            productId: 'sauce-labs-backpack',
            productName: 'Sauce Labs Backpack',
            quantity: 2,
            pricePerUnit: 29.99,
        });

        // Verify order items
        const orderItems = await orderRepository.getItems(order.id);
        expect(orderItems.length).toBe(1);
        expect(orderItems[0].quantity).toBe(2);
        expect(parseFloat(orderItems[0].total_price as any)).toBe(59.98);

        // Verify calculated total matches
        const calculatedTotal = await orderRepository.calculateTotal(order.id);
        expect(calculatedTotal).toBe(59.98);

        // Cleanup
        await orderRepository.deleteById(order.id);
    });

    test('should update order status', { tag: '@database' }, async ({ orderRepository, userRepository }) => {
        // Get a test user
        const user = await userRepository.findByUsername('standard_user');

        // Create an order
        const orderNumber = `TEST-ORD-${Date.now()}`;
        const order = await orderRepository.create({
            userId: user!.id,
            orderNumber,
            totalAmount: 29.99,
            status: OrderStatus.PENDING,
        });

        // Update status to confirmed
        const updatedOrder = await orderRepository.updateStatus(order.id, OrderStatus.CONFIRMED);

        expect(updatedOrder?.status).toBe(OrderStatus.CONFIRMED);
        expect(updatedOrder?.updated_at).toBeDefined();

        // Cleanup
        await orderRepository.deleteById(order.id);
    });

    test('should filter orders by status', { tag: '@database' }, async ({ orderRepository }) => {
        const confirmedOrders = await orderRepository.findByStatus(OrderStatus.CONFIRMED);

        confirmedOrders.forEach((order) => {
            expect(order.status).toBe(OrderStatus.CONFIRMED);
        });
    });
});

test.describe('Database Testing - Transactions', () => {
    test('should handle database transactions', { tag: '@database' }, async ({ dbClient, userRepository }) => {
        const client = await dbClient.beginTransaction();

        try {
            // Insert user within transaction using parameterized query
            const userData = {
                username: `tx_user_${Date.now()}`,
                email: `tx${Date.now()}@example.com`,
                first_name: 'Transaction',
                last_name: 'Test',
            };

            const columns = Object.keys(userData);
            const values = Object.values(userData);
            const placeholders = columns.map((_, i) => `$${i + 1}`);

            const insertQuery = `
                INSERT INTO users (${columns.join(', ')})
                VALUES (${placeholders.join(', ')})
                RETURNING *
            `;

            const result = await client.query(insertQuery, values);
            const userId = result.rows[0].id;

            // Verify user exists in transaction using parameterized query
            const userCheck = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
            expect(userCheck.rows.length).toBe(1);

            // Rollback transaction
            await dbClient.rollbackTransaction(client);

            // Verify user doesn't exist after rollback
            const userAfterRollback = await userRepository.findById(userId);
            expect(userAfterRollback).toBeNull();
        } catch (error) {
            await dbClient.rollbackTransaction(client);
            throw error;
        }
    });

    test('should commit transaction successfully', { tag: '@database' }, async ({ dbClient, userRepository }) => {
        const client = await dbClient.beginTransaction();
        let userId: number;

        try {
            // Insert user within transaction using parameterized query
            const userData = {
                username: `commit_user_${Date.now()}`,
                email: `commit${Date.now()}@example.com`,
                first_name: 'Commit',
                last_name: 'Test',
            };

            const columns = Object.keys(userData);
            const values = Object.values(userData);
            const placeholders = columns.map((_, i) => `$${i + 1}`);

            const insertQuery = `
                INSERT INTO users (${columns.join(', ')})
                VALUES (${placeholders.join(', ')})
                RETURNING *
            `;

            const result = await client.query(insertQuery, values);
            userId = result.rows[0].id;

            // Commit transaction
            await dbClient.commitTransaction(client);

            // Verify user exists after commit
            const userAfterCommit = await userRepository.findById(userId);
            expect(userAfterCommit).toBeTruthy();
            expect(userAfterCommit?.username).toContain('commit_user_');

            // Cleanup
            await userRepository.deleteById(userId);
        } catch (error) {
            await dbClient.rollbackTransaction(client);
            throw error;
        }
    });
});

test.describe('Database Testing - Data Integrity', () => {
    test('should enforce foreign key constraints', { tag: '@database' }, async ({ orderRepository }) => {
        // Try to create order for non-existent user
        const invalidUserId = 999999;

        await expect(
            orderRepository.create({
                userId: invalidUserId,
                orderNumber: `INVALID-${Date.now()}`,
                totalAmount: 100,
                status: OrderStatus.PENDING,
            })
        ).rejects.toThrow();
    });

    test('should enforce unique constraints', { tag: '@database' }, async ({ userRepository }) => {
        const username = `unique_test_${Date.now()}`;
        const email = `unique_test_${Date.now()}@example.com`;

        // Create first user
        const user1 = await userRepository.create({
            username,
            email,
            first_name: 'Unique',
            last_name: 'Test',
        });

        // Try to create duplicate user
        await expect(
            userRepository.create({
                username, // Same username
                email: 'different@example.com',
                first_name: 'Duplicate',
                last_name: 'Test',
            })
        ).rejects.toThrow();

        // Cleanup
        await userRepository.deleteById(user1.id);
    });

    test('should verify cascading deletes', { tag: '@database' }, async ({ userRepository, orderRepository }) => {
        // Create user
        const user = await userRepository.create({
            username: `cascade_test_${Date.now()}`,
            email: `cascade${Date.now()}@example.com`,
            first_name: 'Cascade',
            last_name: 'Test',
        });

        // Create order for user
        const order = await orderRepository.create({
            userId: user.id,
            orderNumber: `CASCADE-${Date.now()}`,
            totalAmount: 100,
            status: OrderStatus.PENDING,
        });

        // Add order item (use existing product from seed data)
        await orderRepository.addItem({
            orderId: order.id,
            productId: 'sauce-labs-backpack',
            productName: 'Sauce Labs Backpack',
            quantity: 1,
            pricePerUnit: 100,
        });

        // Delete user (should cascade to orders and order_items)
        await userRepository.deleteById(user.id);

        // Verify order is deleted
        const deletedOrder = await orderRepository.findByOrderNumber(order.order_number);
        expect(deletedOrder).toBeNull();
    });
});

test.describe('Database Testing - Schema Validation', () => {
    test('should validate User schema on database query', { tag: '@database' }, async ({ userRepository }) => {
        const user = await userRepository.findByUsername('standard_user');

        // User is already validated by the repository, but let's explicitly test it
        if (user) {
            const result = safeValidateDbSchema(DbUserSchema, user);

            expect(result.success).toBeTruthy();
            if (result.success) {
                expect(result.data.username).toBe('standard_user');
                expect(result.data.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
                expect(result.data.created_at).toBeInstanceOf(Date);
            }
        }
    });

    test('should validate Product schema on database query', { tag: '@database' }, async ({ productRepository }) => {
        const product = await productRepository.findById('sauce-labs-backpack');

        if (product) {
            const result = safeValidateDbSchema(DbProductSchema, product);

            expect(result.success).toBeTruthy();
            if (result.success) {
                expect(result.data.id).toBe('sauce-labs-backpack');
                expect(result.data.price).toBeGreaterThan(0);
                expect(result.data.inventory_count).toBeGreaterThanOrEqual(0);
                expect(result.data.created_at).toBeInstanceOf(Date);
            }
        }
    });

    test('should validate Order and OrderItem schemas', { tag: '@database' }, async ({
        orderRepository,
        userRepository,
    }) => {
        const user = await userRepository.findByUsername('standard_user');
        expect(user).toBeTruthy();

        // Create order
        const order = await orderRepository.create({
            userId: user!.id,
            orderNumber: `SCHEMA-TEST-${Date.now()}`,
            totalAmount: 150.0,
            status: OrderStatus.PENDING,
        });

        // Validate order schema
        const orderResult = safeValidateDbSchema(DbOrderSchema, order);
        expect(orderResult.success).toBeTruthy();

        // Add order item
        const orderItem = await orderRepository.addItem({
            orderId: order.id,
            productId: 'sauce-labs-backpack',
            productName: 'Sauce Labs Backpack',
            quantity: 5,
            pricePerUnit: 29.99,
        });

        // Validate order item schema
        const itemResult = safeValidateDbSchema(DbOrderItemSchema, orderItem);
        expect(itemResult.success).toBeTruthy();
        if (itemResult.success) {
            expect(itemResult.data.order_id).toBe(order.id);
            expect(itemResult.data.quantity).toBe(5);
            expect(itemResult.data.total_price).toBe(149.95);
        }

        // Cleanup
        await orderRepository.deleteById(order.id);
    });

    test('should detect schema validation errors', { tag: '@database' }, async () => {
        const invalidUser = {
            id: 1,
            username: 'testuser',
            email: 'invalid-email', // Invalid email format
            first_name: 'Test',
            last_name: 'User',
            created_at: 'not-a-date', // Invalid date
            updated_at: 'not-a-date', // Invalid date
        };

        // Schema validation should fail for invalid data
        try {
            DbUserSchema.parse(invalidUser);
            // If we get here, test should fail
            expect(true).toBe(false);
        } catch (error) {
            // Validation correctly threw error
            expect(error).toBeDefined();
        }
    });

    test('should handle schema validation with type coercion', { tag: '@database' }, async ({
        productRepository,
    }) => {
        const product = await productRepository.findById('sauce-labs-backpack');

        if (product) {
            // Zod's coerce should handle string -> number conversion for price
            // and string -> Date conversion for timestamps
            expect(typeof product.price).toBe('number');
            expect(product.created_at).toBeInstanceOf(Date);
            expect(product.updated_at).toBeInstanceOf(Date);
        }
    });
});
