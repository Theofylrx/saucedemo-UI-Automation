/**
 * API Response Models
 */

export interface ApiResponse<T = any> {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: T;
    ok: boolean;
}

/**
 * User Models (for JSONPlaceholder API demo)
 */
export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    address?: Address;
    phone?: string;
    website?: string;
    company?: Company;
}

export interface Address {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo?: {
        lat: string;
        lng: string;
    };
}

export interface Company {
    name: string;
    catchPhrase: string;
    bs: string;
}

/**
 * Post Models
 */
export interface Post {
    id: number;
    userId: number;
    title: string;
    body: string;
}

/**
 * Order Models (for mock API - e-commerce related)
 */
export interface Order {
    id: number;
    userId: number;
    products: OrderProduct[];
    totalAmount: number;
    status: OrderStatus;
    createdAt: string;
    updatedAt: string;
}

export interface OrderProduct {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
}

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

/**
 * Product Models (for e-commerce)
 */
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    inventory: number;
    category: string;
}

/**
 * Error Response Model
 */
export interface ApiError {
    error: string;
    message: string;
    statusCode: number;
}
