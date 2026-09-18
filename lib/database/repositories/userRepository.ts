/**
 * User Repository
 * High-level repository for user-related database operations
 * Follows Repository Pattern (like Page Object Model for Database)
 */

import { DbClient } from '../clients/dbClient';
import { DbUser } from '../models/dbModels';
import { DbUserSchema, DbUserArraySchema, validateDbSchema } from '../schemas/dbSchemas';

export interface CreateUserData {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

export interface UpdateUserData {
    email?: string;
    first_name?: string;
    last_name?: string;
}

export class UserRepository {
    constructor(private dbClient: DbClient) {}

    /**
     * Find user by username
     */
    async findByUsername(username: string): Promise<DbUser | null> {
        const users = await this.dbClient.queryRows<DbUser>(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );
        const user = users[0] || null;
        return user ? validateDbSchema(DbUserSchema, user, `findByUsername(${username})`) : null;
    }

    /**
     * Find user by ID
     */
    async findById(id: number): Promise<DbUser | null> {
        const user = await this.dbClient.queryOne<DbUser>('SELECT * FROM users WHERE id = $1', [id]);
        return user ? validateDbSchema(DbUserSchema, user, `findById(${id})`) : null;
    }

    /**
     * Find user by email
     */
    async findByEmail(email: string): Promise<DbUser | null> {
        const user = await this.dbClient.queryOne<DbUser>('SELECT * FROM users WHERE email = $1', [email]);
        return user ? validateDbSchema(DbUserSchema, user, `findByEmail(${email})`) : null;
    }

    /**
     * Get all users
     */
    async findAll(): Promise<DbUser[]> {
        const users = await this.dbClient.queryRows<DbUser>('SELECT * FROM users');
        return validateDbSchema(DbUserArraySchema, users, 'findAll');
    }

    /**
     * Create a new user
     */
    async create(userData: CreateUserData): Promise<DbUser> {
        const user = await this.dbClient.insert<DbUser>('users', userData);
        return validateDbSchema(DbUserSchema, user, 'create');
    }

    /**
     * Update user by ID
     */
    async update(id: number, userData: UpdateUserData): Promise<DbUser | null> {
        const result = await this.dbClient.query<DbUser>(
            `UPDATE users
             SET email = COALESCE($2, email),
                 first_name = COALESCE($3, first_name),
                 last_name = COALESCE($4, last_name),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $1
             RETURNING *`,
            [id, userData.email, userData.first_name, userData.last_name]
        );
        const user = result.rows[0] || null;
        return user ? validateDbSchema(DbUserSchema, user, `update(${id})`) : null;
    }

    /**
     * Delete user by ID
     */
    async deleteById(id: number): Promise<void> {
        await this.dbClient.query('DELETE FROM users WHERE id = $1', [id]);
    }

    /**
     * Count total users
     */
    async count(): Promise<number> {
        return this.dbClient.getRowCount('users');
    }

    /**
     * Validate email format
     */
    async getAllWithValidEmail(): Promise<DbUser[]> {
        const users = await this.findAll();
        return users.filter((user) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email));
    }

    /**
     * Check if user exists
     */
    async exists(id: number): Promise<boolean> {
        const user = await this.findById(id);
        return user !== null;
    }
}
