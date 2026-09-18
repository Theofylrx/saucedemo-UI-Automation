/**
 * Database Schema Validators
 * Runtime schema validation using Zod for database query results
 * Ensures database schema contracts are maintained
 */

import { z } from 'zod';
import { OrderStatus } from '../models/dbModels';

/**
 * Order Status Enum Schema
 */
export const DbOrderStatusSchema = z.nativeEnum(OrderStatus);

/**
 * Database User Schema
 * Validates user records from database
 */
export const DbUserSchema = z.object({
    id: z.number().positive(),
    username: z.string().min(1),
    email: z.string().email(),
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    created_at: z.coerce.date(), // Coerce handles string -> Date conversion
    updated_at: z.coerce.date(),
});

/**
 * User Array Schema
 */
export const DbUserArraySchema = z.array(DbUserSchema);

/**
 * Database Order Schema
 * Validates order records from database
 */
export const DbOrderSchema = z.object({
    id: z.number().positive(),
    user_id: z.number().positive(),
    order_number: z.string().min(1),
    total_amount: z.coerce.number().positive(), // Coerce handles string -> number conversion for DECIMAL
    status: DbOrderStatusSchema,
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
});

/**
 * Order Array Schema
 */
export const DbOrderArraySchema = z.array(DbOrderSchema);

/**
 * Database Order Item Schema
 * Validates order item records from database
 */
export const DbOrderItemSchema = z.object({
    id: z.number().positive(),
    order_id: z.number().positive(),
    product_id: z.string(),
    product_name: z.string().min(1),
    quantity: z.number().positive(),
    unit_price: z.coerce.number().positive(),
    total_price: z.coerce.number().positive(),
    created_at: z.coerce.date(),
});

/**
 * Order Item Array Schema
 */
export const DbOrderItemArraySchema = z.array(DbOrderItemSchema);

/**
 * Database Product Schema
 * Validates product records from database
 */
export const DbProductSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    description: z.string(),
    price: z.coerce.number().positive(),
    inventory_count: z.number().nonnegative(),
    category: z.string().min(1),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
});

/**
 * Product Array Schema
 */
export const DbProductArraySchema = z.array(DbProductSchema);

/**
 * Database Session Schema
 * Validates session records from database
 */
export const DbSessionSchema = z.object({
    id: z.number().positive(),
    user_id: z.number().positive(),
    session_token: z.string(),
    ip_address: z.string(), // IP address validation (removed .ip() - not available in Zod)
    user_agent: z.string(),
    created_at: z.coerce.date(),
    expires_at: z.coerce.date(),
});

/**
 * Session Array Schema
 */
export const DbSessionArraySchema = z.array(DbSessionSchema);

/**
 * Helper function to safely validate database data
 * Returns validated data or throws with detailed error
 */
export function validateDbSchema<T>(schema: z.ZodSchema<T>, data: unknown, context: string): T {
    try {
        return schema.parse(data);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const formattedErrors = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
            throw new Error(`Database schema validation failed for ${context}: ${formattedErrors}`);
        }
        throw error;
    }
}

/**
 * Helper function to safely validate database data without throwing
 * Returns result object with success/error information
 */
export function safeValidateDbSchema<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
}

/**
 * Partial schemas for update operations (all fields optional)
 */
export const DbUserUpdateSchema = DbUserSchema.partial().omit({ id: true, created_at: true });
export const DbProductUpdateSchema = DbProductSchema.partial().omit({ id: true, created_at: true });
export const DbOrderUpdateSchema = DbOrderSchema.partial().omit({ id: true, created_at: true });
