/**
 * API Schema Validators
 * Runtime schema validation using Zod for API responses
 * Ensures API contracts are maintained and response structure is validated
 */

import { z } from 'zod';
import { OrderStatus } from '../models/apiModels';

/**
 * User Address Schema
 */
export const AddressSchema = z.object({
    street: z.string(),
    suite: z.string(),
    city: z.string(),
    zipcode: z.string(),
    geo: z
        .object({
            lat: z.string(),
            lng: z.string(),
        })
        .optional(),
});

/**
 * User Company Schema
 */
export const CompanySchema = z.object({
    name: z.string(),
    catchPhrase: z.string(),
    bs: z.string(),
});

/**
 * User Schema
 * Validates complete user object from API
 */
export const UserSchema = z.object({
    id: z.number().positive(),
    name: z.string().min(1),
    username: z.string().min(1),
    email: z.string().email(),
    address: AddressSchema.optional(),
    phone: z.string().optional(),
    website: z.string().optional(),
    company: CompanySchema.optional(),
});

/**
 * User Array Schema
 */
export const UserArraySchema = z.array(UserSchema);

/**
 * Post Schema
 * Validates post object from API
 */
export const PostSchema = z.object({
    id: z.number().positive(),
    userId: z.number().positive(),
    title: z.string().min(1),
    body: z.string(),
});

/**
 * Post Array Schema
 */
export const PostArraySchema = z.array(PostSchema);

/**
 * Order Product Schema
 */
export const OrderProductSchema = z.object({
    productId: z.string(),
    productName: z.string(),
    quantity: z.number().positive(),
    price: z.number().positive(),
});

/**
 * Order Status Enum Schema
 */
export const OrderStatusSchema = z.nativeEnum(OrderStatus);

/**
 * Order Schema
 * Validates order object from Mock API
 */
export const OrderSchema = z.object({
    id: z.number().positive(),
    userId: z.number().positive(),
    products: z.array(OrderProductSchema),
    totalAmount: z.number().positive(),
    status: OrderStatusSchema,
    createdAt: z.string(),
    updatedAt: z.string(),
});

/**
 * Order Array Schema
 */
export const OrderArraySchema = z.array(OrderSchema);

/**
 * Product Schema
 * Validates product object from Mock API
 */
export const ProductSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    description: z.string(),
    price: z.number().positive(),
    inventory: z.number().nonnegative(),
    category: z.string().min(1),
});

/**
 * Product Array Schema
 */
export const ProductArraySchema = z.array(ProductSchema);

/**
 * API Error Schema
 */
export const ApiErrorSchema = z.object({
    error: z.string(),
    message: z.string(),
    statusCode: z.number(),
});

/**
 * Helper function to safely validate data
 * Returns validated data or throws with detailed error
 */
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown, context: string): T {
    try {
        return schema.parse(data);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const formattedErrors = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
            throw new Error(`Schema validation failed for ${context}: ${formattedErrors}`);
        }
        throw error;
    }
}

/**
 * Helper function to safely validate data without throwing
 * Returns result object with success/error information
 */
export function safeValidateSchema<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
}
