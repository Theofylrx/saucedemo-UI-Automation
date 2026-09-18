/**
 * Post Service
 * High-level service for post-related API operations
 * Follows Service Layer pattern (like Page Object Model for APIs)
 */

import { ApiClient } from '../clients/apiClient';
import { Post } from '../models/apiModels';
import { PostSchema, PostArraySchema, validateSchema } from '../schemas/apiSchemas';

export interface CreatePostDto {
    title: string;
    body: string;
    userId: number;
}

export interface PostQueryParams {
    userId?: number;
    _page?: number;
    _limit?: number;
}

export class PostService {
    constructor(private apiClient: ApiClient) {}

    /**
     * Get all posts with optional pagination
     */
    async getAllPosts(params?: PostQueryParams): Promise<Post[]> {
        const response = await this.apiClient.get('/posts', { params });
        return validateSchema(PostArraySchema, response.body, 'getAllPosts');
    }

    /**
     * Get posts by user ID
     */
    async getPostsByUserId(userId: number): Promise<Post[]> {
        const response = await this.apiClient.get('/posts', {
            params: { userId },
        });
        return validateSchema(PostArraySchema, response.body, `getPostsByUserId(${userId})`);
    }

    /**
     * Get post by ID
     */
    async getPostById(postId: number): Promise<Post> {
        const response = await this.apiClient.get(`/posts/${postId}`);
        return validateSchema(PostSchema, response.body, `getPostById(${postId})`);
    }

    /**
     * Create a new post
     */
    async createPost(postData: CreatePostDto): Promise<Post> {
        const response = await this.apiClient.post('/posts', postData);
        return validateSchema(PostSchema, response.body, 'createPost');
    }

    /**
     * Get posts with pagination
     */
    async getPostsPaginated(page: number = 1, limit: number = 10): Promise<Post[]> {
        const response = await this.apiClient.get('/posts', {
            params: { _page: page, _limit: limit },
        });
        return validateSchema(PostArraySchema, response.body, `getPostsPaginated(${page},${limit})`);
    }
}
