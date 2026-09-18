import { DbClient } from '../clients/dbClient';
import { DbOrder, DbOrderItem, OrderStatus } from '../models/dbModels';

/**
 * Order-related database queries
 * Provides reusable query methods for order operations
 */
export class OrderQueries {
    constructor(private dbClient: DbClient) {}

    /**
     * Get all orders for a user
     */
    async getOrdersByUserId(userId: number): Promise<DbOrder[]> {
        return await this.dbClient.queryRows<DbOrder>(
            'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
    }

    /**
     * Get order by order number
     */
    async getOrderByNumber(orderNumber: string): Promise<DbOrder | null> {
        return await this.dbClient.queryOne<DbOrder>(
            'SELECT * FROM orders WHERE order_number = $1',
            [orderNumber]
        );
    }

    /**
     * Get order items for an order
     */
    async getOrderItems(orderId: number): Promise<DbOrderItem[]> {
        return await this.dbClient.queryRows<DbOrderItem>(
            'SELECT * FROM order_items WHERE order_id = $1 ORDER BY id',
            [orderId]
        );
    }

    /**
     * Create a new order
     */
    async createOrder(
        userId: number,
        orderNumber: string,
        totalAmount: number,
        status: OrderStatus = OrderStatus.PENDING
    ): Promise<DbOrder> {
        return await this.dbClient.insert<DbOrder>('orders', {
            user_id: userId,
            order_number: orderNumber,
            total_amount: totalAmount,
            status,
        });
    }

    /**
     * Add item to order
     */
    async addOrderItem(
        orderId: number,
        productId: string,
        productName: string,
        quantity: number,
        unitPrice: number
    ): Promise<DbOrderItem> {
        const totalPrice = quantity * unitPrice;

        return await this.dbClient.insert<DbOrderItem>('order_items', {
            order_id: orderId,
            product_id: productId,
            product_name: productName,
            quantity,
            unit_price: unitPrice,
            total_price: totalPrice,
        });
    }

    /**
     * Update order status
     */
    async updateOrderStatus(orderId: number, status: OrderStatus): Promise<DbOrder | null> {
        return await this.dbClient.queryOne<DbOrder>(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
            [status, orderId]
        );
    }

    /**
     * Calculate order total from items
     */
    async calculateOrderTotal(orderId: number): Promise<number> {
        const result = await this.dbClient.queryOne<{ total: string }>(
            'SELECT SUM(total_price) as total FROM order_items WHERE order_id = $1',
            [orderId]
        );
        return parseFloat(result?.total || '0');
    }

    /**
     * Get orders by status
     */
    async getOrdersByStatus(status: OrderStatus): Promise<DbOrder[]> {
        return await this.dbClient.queryRows<DbOrder>(
            'SELECT * FROM orders WHERE status = $1 ORDER BY created_at DESC',
            [status]
        );
    }

    /**
     * Delete order (cascade deletes order items)
     */
    async deleteOrder(orderId: number): Promise<void> {
        await this.dbClient.query('DELETE FROM orders WHERE id = $1', [orderId]);
    }
}
