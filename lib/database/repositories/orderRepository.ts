/**
 * Order Repository
 * High-level repository for order-related database operations
 * Follows Repository Pattern (like Page Object Model for Database)
 * Uses OrderQueries as base, adds high-level business methods
 */

import { DbClient } from '../clients/dbClient';
import { DbOrder, DbOrderItem, OrderStatus } from '../models/dbModels';
import { OrderQueries } from '../queries/orderQueries';
import {
    DbOrderSchema,
    DbOrderArraySchema,
    DbOrderItemSchema,
    DbOrderItemArraySchema,
    validateDbSchema,
} from '../schemas/dbSchemas';

export interface CreateOrderData {
    userId: number;
    orderNumber: string;
    totalAmount: number;
    status?: OrderStatus;
}

export interface AddOrderItemData {
    orderId: number;
    productId: string;
    productName: string;
    quantity: number;
    pricePerUnit: number;
}

export class OrderRepository {
    private orderQueries: OrderQueries;

    constructor(private dbClient: DbClient) {
        this.orderQueries = new OrderQueries(dbClient);
    }

    /**
     * Find order by ID
     */
    async findById(orderId: number): Promise<DbOrder | null> {
        const order = await this.dbClient.queryOne<DbOrder>('SELECT * FROM orders WHERE id = $1', [orderId]);
        return order ? validateDbSchema(DbOrderSchema, order, `findById(${orderId})`) : null;
    }

    /**
     * Find order by order number
     */
    async findByOrderNumber(orderNumber: string): Promise<DbOrder | null> {
        const order = await this.orderQueries.getOrderByNumber(orderNumber);
        return order ? validateDbSchema(DbOrderSchema, order, `findByOrderNumber(${orderNumber})`) : null;
    }

    /**
     * Get all orders by status
     */
    async findByStatus(status: OrderStatus): Promise<DbOrder[]> {
        const orders = await this.orderQueries.getOrdersByStatus(status);
        return validateDbSchema(DbOrderArraySchema, orders, `findByStatus(${status})`);
    }

    /**
     * Get orders by user ID
     */
    async findByUserId(userId: number): Promise<DbOrder[]> {
        const orders = await this.dbClient.queryRows<DbOrder>(
            'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        return validateDbSchema(DbOrderArraySchema, orders, `findByUserId(${userId})`);
    }

    /**
     * Create a new order
     */
    async create(orderData: CreateOrderData): Promise<DbOrder> {
        const order = await this.orderQueries.createOrder(
            orderData.userId,
            orderData.orderNumber,
            orderData.totalAmount,
            orderData.status || OrderStatus.PENDING
        );
        return validateDbSchema(DbOrderSchema, order, 'create');
    }

    /**
     * Add item to order
     */
    async addItem(itemData: AddOrderItemData): Promise<DbOrderItem> {
        const item = await this.orderQueries.addOrderItem(
            itemData.orderId,
            itemData.productId,
            itemData.productName,
            itemData.quantity,
            itemData.pricePerUnit
        );
        return validateDbSchema(DbOrderItemSchema, item, 'addItem');
    }

    /**
     * Get all items for an order
     */
    async getItems(orderId: number): Promise<DbOrderItem[]> {
        const items = await this.orderQueries.getOrderItems(orderId);
        return validateDbSchema(DbOrderItemArraySchema, items, `getItems(${orderId})`);
    }

    /**
     * Update order status
     */
    async updateStatus(orderId: number, status: OrderStatus): Promise<DbOrder | null> {
        const order = await this.orderQueries.updateOrderStatus(orderId, status);
        return order ? validateDbSchema(DbOrderSchema, order, `updateStatus(${orderId})`) : null;
    }

    /**
     * Calculate order total
     */
    async calculateTotal(orderId: number): Promise<number> {
        return this.orderQueries.calculateOrderTotal(orderId);
    }

    /**
     * Delete order (cascades to order items)
     */
    async deleteById(orderId: number): Promise<void> {
        await this.orderQueries.deleteOrder(orderId);
    }

    /**
     * Get order with items
     */
    async findWithItems(orderId: number): Promise<{
        order: DbOrder | null;
        items: DbOrderItem[];
    }> {
        const order = await this.findById(orderId);
        const items = order ? await this.getItems(orderId) : [];
        return { order, items };
    }

    /**
     * Verify order total matches items
     */
    async verifyOrderTotal(orderId: number): Promise<boolean> {
        const order = await this.findById(orderId);
        if (!order) return false;

        const calculatedTotal = await this.calculateTotal(orderId);
        const orderTotal = parseFloat(order.total_amount as any);

        return Math.abs(calculatedTotal - orderTotal) < 0.01; // Allow for floating point precision
    }
}
