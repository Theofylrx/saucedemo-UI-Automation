import { apiTest as test, expect } from '../../lib/api/helpers/apiBaseTest';
import { OrderStatus } from '../../lib/api/models/apiModels';
import {
    UserSchema,
    PostSchema,
    ProductSchema,
    OrderSchema,
    safeValidateSchema,
} from '../../lib/api/schemas/apiSchemas';

/**
 * API Integration Tests
 * Uses Service Layer (like Page Object Model for APIs)
 * Tests call high-level business methods instead of low-level HTTP methods
 */

test.describe('API Testing - User Management', () => {
    test('should fetch list of users', { tag: '@api' }, async ({ userService }) => {
        const users = await userService.getAllUsers();

        expect(users.length).toBeGreaterThan(0);

        const user = users[0];
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('email');
        expect(userService.validateEmailFormat(user.email)).toBeTruthy();
    });

    test('should fetch a single user by ID', { tag: '@api' }, async ({ userService }) => {
        const userId = 1;
        const user = await userService.getUserById(userId);

        expect(user.id).toBe(userId);
        expect(user.name).toBeTruthy();
        expect(user.email).toBeTruthy();
    });

    test('should create a new user', { tag: '@api' }, async ({ userService }) => {
        const createdUser = await userService.createUser({
            name: 'Test User',
            username: 'testuser',
            email: 'testuser@example.com',
        });

        expect(createdUser.name).toBe('Test User');
        expect(createdUser.email).toBe('testuser@example.com');
        expect(createdUser.id).toBeDefined();
    });

    test('should update an existing user', { tag: '@api' }, async ({ userService }) => {
        const updatedUser = await userService.updateUser(1, {
            name: 'Updated Name',
            email: 'updated@example.com',
        });

        expect(updatedUser.name).toBe('Updated Name');
    });

    test('should delete a user', { tag: '@api' }, async ({ userService }) => {
        await userService.deleteUser(1);
    });

    test('should return 404 for non-existent user', { tag: '@api' }, async ({ userService }) => {
        const exists = await userService.userExists(999999);
        expect(exists).toBeFalsy();
    });
});

test.describe('API Testing - Posts Management', () => {
    test('should fetch posts with pagination', { tag: '@api' }, async ({ postService }) => {
        const posts = await postService.getPostsPaginated(1, 10);

        expect(Array.isArray(posts)).toBeTruthy();
        expect(posts.length).toBeLessThanOrEqual(10);

        if (posts.length > 0) {
            const post = posts[0];
            expect(post).toHaveProperty('id');
            expect(post).toHaveProperty('title');
            expect(post).toHaveProperty('body');
            expect(post).toHaveProperty('userId');
        }
    });

    test('should create a new post', { tag: '@api' }, async ({ postService }) => {
        const createdPost = await postService.createPost({
            title: 'Test Post',
            body: 'This is a test post created via API',
            userId: 1,
        });

        expect(createdPost.title).toBe('Test Post');
        expect(createdPost.body).toBe('This is a test post created via API');
        expect(createdPost.userId).toBe(1);
        expect(createdPost.id).toBeDefined();
    });

    test('should filter posts by userId', { tag: '@api' }, async ({ postService }) => {
        const posts = await postService.getPostsByUserId(1);

        expect(Array.isArray(posts)).toBeTruthy();
        posts.forEach((post) => {
            expect(post.userId).toBe(1);
        });
    });
});

test.describe('API Testing - E-commerce Mock API', () => {
    test('should fetch products from mock API', { tag: '@api' }, async ({ productService }) => {
        const products = await productService.getAllProducts();

        expect(Array.isArray(products)).toBeTruthy();

        if (products.length > 0) {
            const product = products[0];
            expect(product).toHaveProperty('id');
            expect(product).toHaveProperty('name');
            expect(product).toHaveProperty('price');
            expect(product.price).toBeGreaterThan(0);
        }
    });

    test('should create an order via mock API', { tag: '@api' }, async ({ orderService }) => {
        const createdOrder = await orderService.createOrder({
            userId: 1,
            products: [
                {
                    productId: 'sauce-labs-backpack',
                    productName: 'Sauce Labs Backpack',
                    quantity: 2,
                    price: 29.99,
                },
            ],
            totalAmount: 59.98,
            status: OrderStatus.PENDING,
        });

        expect(createdOrder.userId).toBe(1);
        expect(createdOrder.totalAmount).toBe(59.98);
        expect(createdOrder.id).toBeDefined();
    });
});

test.describe('API Testing - Authentication & Headers', () => {
    test('should send custom headers with request', { tag: '@api' }, async ({ userService, apiClient }) => {
        // Access underlying client for custom headers
        const response = await apiClient.get('/users/1', {
            headers: { 'X-Custom-Header': 'test-value' },
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBeTruthy();
    });

    test('should handle authentication token', { tag: '@api' }, async ({ userService, apiClient }) => {
        apiClient.setAuthToken('fake-jwt-token-for-testing');

        const user = await userService.getUserById(1);
        expect(user.id).toBe(1);

        apiClient.removeAuthToken();
    });
});

test.describe('API Testing - Response Validation', () => {
    test('should validate response headers', { tag: '@api' }, async ({ apiClient }) => {
        const response = await apiClient.get('/users/1');

        expect(response.headers).toBeDefined();
        expect(response.headers['content-type']).toContain('application/json');
    });

    test('should handle different HTTP status codes', { tag: '@api' }, async ({ userService }) => {
        const userExists = await userService.userExists(1);
        expect(userExists).toBeTruthy();

        const userNotExists = await userService.userExists(999999);
        expect(userNotExists).toBeFalsy();
    });

    test('should validate complex nested response structure', { tag: '@api' }, async ({ userService }) => {
        const user = await userService.getUserById(1);

        expect(user).toHaveProperty('address');
        expect(user.address).toHaveProperty('street');
        expect(user.address).toHaveProperty('city');

        if (user.address?.geo) {
            expect(user.address.geo).toHaveProperty('lat');
            expect(user.address.geo).toHaveProperty('lng');
        }
    });
});

test.describe('API Testing - Schema Validation', () => {
    test('should validate User schema on API response', { tag: '@api' }, async ({ userService }) => {
        const user = await userService.getUserById(1);

        // User is already validated by the service, but let's explicitly test it
        const result = safeValidateSchema(UserSchema, user);

        expect(result.success).toBeTruthy();
        if (result.success) {
            expect(result.data.id).toBe(1);
            expect(result.data.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        }
    });

    test('should validate Post schema on API response', { tag: '@api' }, async ({ postService }) => {
        const post = await postService.getPostById(1);

        const result = safeValidateSchema(PostSchema, post);

        expect(result.success).toBeTruthy();
        if (result.success) {
            expect(result.data.id).toBeGreaterThan(0);
            expect(result.data.userId).toBeGreaterThan(0);
            expect(result.data.title).toBeTruthy();
        }
    });

    test('should validate Product schema on Mock API response', { tag: '@api' }, async ({ productService }) => {
        const products = await productService.getAllProducts();

        if (products.length > 0) {
            const result = safeValidateSchema(ProductSchema, products[0]);

            expect(result.success).toBeTruthy();
            if (result.success) {
                expect(result.data.price).toBeGreaterThan(0);
                expect(result.data.inventory).toBeGreaterThanOrEqual(0);
            }
        }
    });

    test('should validate Order schema on Mock API response', { tag: '@api' }, async ({ orderService }) => {
        const order = await orderService.createOrder({
            userId: 1,
            products: [
                {
                    productId: 'test-product',
                    productName: 'Test Product',
                    quantity: 1,
                    price: 99.99,
                },
            ],
            totalAmount: 99.99,
        });

        const result = safeValidateSchema(OrderSchema, order);

        expect(result.success).toBeTruthy();
        if (result.success) {
            expect(result.data.userId).toBe(1);
            expect(result.data.totalAmount).toBe(99.99);
            expect(result.data.status).toBe(OrderStatus.PENDING);
            expect(result.data.products).toHaveLength(1);
        }
    });

    test('should detect schema validation errors', { tag: '@api' }, async () => {
        const invalidUser = {
            id: 'not-a-number', // Should be number
            name: 123, // Should be string
            email: 'invalid-email', // Should be valid email
        };

        // Schema validation should fail for invalid data
        try {
            UserSchema.parse(invalidUser);
            // If we get here, test should fail
            expect(true).toBe(false);
        } catch (error) {
            // Validation correctly threw error
            expect(error).toBeDefined();
        }
    });
});
