/**
 * Order Service
 * High-level service for order-related API operations (Mock API)
 * Follows Service Layer pattern (like Page Object Model for APIs)
 */

import { ApiClient } from '../clients/apiClient';
import { Order, OrderProduct, OrderStatus } from '../models/apiModels';
import { OrderSchema, OrderArraySchema, validateSchema } from '../schemas/apiSchemas';

export interface CreateOrderDto {
    userId: number;
    products: OrderProduct[];
    totalAmount: number;
    status?: OrderStatus;
}

export class OrderService {
    constructor(private apiClient: ApiClient) {}

    /**
     * Get all orders
     */
    async getAllOrders(): Promise<Order[]> {
        const response = await this.apiClient.get('/orders');
        return validateSchema(OrderArraySchema, response.body, 'getAllOrders');
    }

    /**
     * Get order by ID
     */
    async getOrderById(orderId: number): Promise<Order> {
        const response = await this.apiClient.get(`/orders/${orderId}`);
        return validateSchema(OrderSchema, response.body, `getOrderById(${orderId})`);
    }

    /**
     * Create a new order
     */
    async createOrder(orderData: CreateOrderDto): Promise<Order> {
        const now = new Date().toISOString();
        const fullOrderData = {
            ...orderData,
            status: orderData.status || OrderStatus.PENDING,
            createdAt: now,
            updatedAt: now,
        };

        const response = await this.apiClient.post('/orders', fullOrderData);
        return validateSchema(OrderSchema, response.body, 'createOrder');
    }

    /**
     * Update order status
     */
    async updateOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
        const response = await this.apiClient.patch(`/orders/${orderId}`, {
            status,
            updatedAt: new Date().toISOString(),
        });
        return validateSchema(OrderSchema, response.body, `updateOrderStatus(${orderId})`);
    }

    /**
     * Get orders by user ID
     */
    async getOrdersByUserId(userId: number): Promise<Order[]> {
        const allOrders = await this.getAllOrders();
        return allOrders.filter((order) => order.userId === userId);
    }

    /**
     * Calculate order total from products
     */
    calculateOrderTotal(products: OrderProduct[]): number {
        return products.reduce((total, product) => {
            return total + product.price * product.quantity;
        }, 0);
    }
}
