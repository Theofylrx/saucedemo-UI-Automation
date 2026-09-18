/**
 * Database Models
 * TypeScript interfaces for database tables
 */

/**
 * User table model
 */
export interface DbUser {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    created_at: Date;
    updated_at: Date;
}

/**
 * Order table model
 */
export interface DbOrder {
    id: number;
    user_id: number;
    order_number: string;
    total_amount: number;
    status: OrderStatus;
    created_at: Date;
    updated_at: Date;
}

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

/**
 * Order Item table model
 */
export interface DbOrderItem {
    id: number;
    order_id: number;
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    created_at: Date;
}

/**
 * Product table model
 */
export interface DbProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    inventory_count: number;
    category: string;
    created_at: Date;
    updated_at: Date;
}

/**
 * Session table model (for tracking user sessions)
 */
export interface DbSession {
    id: number;
    user_id: number;
    session_token: string;
    ip_address: string;
    user_agent: string;
    created_at: Date;
    expires_at: Date;
}
