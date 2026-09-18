/**
 * Product Repository
 * High-level repository for product-related database operations
 * Follows Repository Pattern (like Page Object Model for Database)
 */

import { DbClient } from '../clients/dbClient';
import { DbProduct } from '../models/dbModels';
import { DbProductSchema, DbProductArraySchema, validateDbSchema } from '../schemas/dbSchemas';

export interface CreateProductData {
    id: string;
    name: string;
    description: string;
    price: number;
    inventory_count: number;
    category: string;
}

export interface UpdateProductData {
    name?: string;
    description?: string;
    price?: number;
    inventory_count?: number;
    category?: string;
}

export class ProductRepository {
    constructor(private dbClient: DbClient) {}

    /**
     * Find product by ID
     */
    async findById(productId: string): Promise<DbProduct | null> {
        const product = await this.dbClient.queryOne<DbProduct>('SELECT * FROM products WHERE id = $1', [productId]);
        return product ? validateDbSchema(DbProductSchema, product, `findById(${productId})`) : null;
    }

    /**
     * Get all products
     */
    async findAll(): Promise<DbProduct[]> {
        const products = await this.dbClient.queryRows<DbProduct>('SELECT * FROM products ORDER BY name');
        return validateDbSchema(DbProductArraySchema, products, 'findAll');
    }

    /**
     * Find products by category
     */
    async findByCategory(category: string): Promise<DbProduct[]> {
        const products = await this.dbClient.queryRows<DbProduct>(
            'SELECT * FROM products WHERE category = $1',
            [category]
        );
        return validateDbSchema(DbProductArraySchema, products, `findByCategory(${category})`);
    }

    /**
     * Find products with low inventory
     */
    async findLowInventory(threshold: number = 10): Promise<DbProduct[]> {
        const products = await this.dbClient.queryRows<DbProduct>(
            'SELECT * FROM products WHERE inventory_count < $1',
            [threshold]
        );
        return validateDbSchema(DbProductArraySchema, products, `findLowInventory(${threshold})`);
    }

    /**
     * Create a new product
     */
    async create(productData: CreateProductData): Promise<DbProduct> {
        const product = await this.dbClient.insert<DbProduct>('products', productData);
        return validateDbSchema(DbProductSchema, product, 'create');
    }

    /**
     * Update product inventory
     */
    async updateInventory(productId: string, inventory: number): Promise<DbProduct | null> {
        const result = await this.dbClient.query<DbProduct>(
            `UPDATE products
             SET inventory_count = $2, updated_at = CURRENT_TIMESTAMP
             WHERE id = $1
             RETURNING *`,
            [productId, inventory]
        );
        const product = result.rows[0] || null;
        return product ? validateDbSchema(DbProductSchema, product, `updateInventory(${productId})`) : null;
    }

    /**
     * Delete product by ID
     */
    async deleteById(productId: string): Promise<void> {
        await this.dbClient.query('DELETE FROM products WHERE id = $1', [productId]);
    }

    /**
     * Calculate total inventory value
     */
    async getTotalInventoryValue(): Promise<number> {
        const result = await this.dbClient.queryOne<{ total_value: string }>(
            'SELECT SUM(price * inventory_count) as total_value FROM products'
        );
        return parseFloat(result?.total_value || '0');
    }

    /**
     * Get product count
     */
    async count(): Promise<number> {
        return this.dbClient.getRowCount('products');
    }

    /**
     * Check if product is in stock
     */
    async isInStock(productId: string): Promise<boolean> {
        const product = await this.findById(productId);
        return product !== null && product.inventory_count > 0;
    }
}
