/**
 * Product Service
 * High-level service for product-related API operations (Mock API)
 * Follows Service Layer pattern (like Page Object Model for APIs)
 */

import { ApiClient } from '../clients/apiClient';
import { Product } from '../models/apiModels';
import { ProductSchema, ProductArraySchema, validateSchema } from '../schemas/apiSchemas';

export interface CreateProductDto {
    id: string;
    name: string;
    description: string;
    price: number;
    inventory: number;
    category: string;
}

export class ProductService {
    constructor(private apiClient: ApiClient) {}

    /**
     * Get all products
     */
    async getAllProducts(): Promise<Product[]> {
        const response = await this.apiClient.get('/products');
        return validateSchema(ProductArraySchema, response.body, 'getAllProducts');
    }

    /**
     * Get product by ID
     */
    async getProductById(productId: string): Promise<Product> {
        const response = await this.apiClient.get(`/products/${productId}`);
        return validateSchema(ProductSchema, response.body, `getProductById(${productId})`);
    }

    /**
     * Create a new product
     */
    async createProduct(productData: CreateProductDto): Promise<Product> {
        const response = await this.apiClient.post('/products', productData);
        return validateSchema(ProductSchema, response.body, 'createProduct');
    }

    /**
     * Update product inventory
     */
    async updateProductInventory(productId: string, inventory: number): Promise<Product> {
        const response = await this.apiClient.patch(`/products/${productId}`, { inventory });
        return validateSchema(ProductSchema, response.body, `updateProductInventory(${productId})`);
    }

    /**
     * Get products by category
     */
    async getProductsByCategory(category: string): Promise<Product[]> {
        const allProducts = await this.getAllProducts();
        return allProducts.filter((p) => p.category === category);
    }

    /**
     * Check if product is in stock
     */
    async isProductInStock(productId: string): Promise<boolean> {
        const product = await this.getProductById(productId);
        return product.inventory > 0;
    }
}
