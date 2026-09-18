/**
 * User Service
 * High-level service for user-related API operations
 * Follows Service Layer pattern (like Page Object Model for APIs)
 */

import { ApiClient } from '../clients/apiClient';
import { User } from '../models/apiModels';
import { UserSchema, UserArraySchema, validateSchema } from '../schemas/apiSchemas';

export interface CreateUserDto {
    name: string;
    username: string;
    email: string;
    phone?: string;
}

export interface UpdateUserDto {
    name?: string;
    email?: string;
    phone?: string;
}

export class UserService {
    constructor(private apiClient: ApiClient) {}

    /**
     * Get all users
     */
    async getAllUsers(): Promise<User[]> {
        const response = await this.apiClient.get('/users');
        return validateSchema(UserArraySchema, response.body, 'getAllUsers');
    }

    /**
     * Get user by ID
     */
    async getUserById(userId: number): Promise<User> {
        const response = await this.apiClient.get(`/users/${userId}`);
        return validateSchema(UserSchema, response.body, `getUserById(${userId})`);
    }

    /**
     * Create a new user
     */
    async createUser(userData: CreateUserDto): Promise<User> {
        const response = await this.apiClient.post('/users', userData);
        return validateSchema(UserSchema, response.body, 'createUser');
    }

    /**
     * Update an existing user
     */
    async updateUser(userId: number, userData: UpdateUserDto): Promise<User> {
        const response = await this.apiClient.patch(`/users/${userId}`, userData);
        return validateSchema(UserSchema, response.body, `updateUser(${userId})`);
    }

    /**
     * Delete a user
     */
    async deleteUser(userId: number): Promise<void> {
        await this.apiClient.delete(`/users/${userId}`);
    }

    /**
     * Check if user exists (returns true if found, false if 404)
     */
    async userExists(userId: number): Promise<boolean> {
        const response = await this.apiClient.get(`/users/${userId}`);
        return response.status === 200;
    }

    /**
     * Validate user email format
     */
    validateEmailFormat(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}
