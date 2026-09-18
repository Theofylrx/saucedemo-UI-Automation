import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';

/**
 * Database Client for PostgreSQL
 * Provides connection pooling and query execution with proper error handling
 */
export class DbClient {
    private pool: Pool | null = null;
    private config: {
        host: string;
        port: number;
        database: string;
        user: string;
        password: string;
    };

    constructor(config?: {
        host?: string;
        port?: number;
        database?: string;
        user?: string;
        password?: string;
    }) {
        // Default to Docker container settings, fallback to environment variables
        this.config = {
            host: config?.host || process.env.DB_HOST || 'localhost',
            port: config?.port || parseInt(process.env.DB_PORT || '5432'),
            database: config?.database || process.env.DB_NAME || 'testdb',
            user: config?.user || process.env.DB_USER || 'testuser',
            password: config?.password || process.env.DB_PASSWORD || 'testpass',
        };
    }

    /**
     * Initialize database connection pool
     */
    async init(): Promise<void> {
        try {
            this.pool = new Pool({
                ...this.config,
                max: 10, // Maximum number of clients in the pool
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 2000,
            });

            // Test connection
            const client = await this.pool.connect();
            await client.query('SELECT NOW()');
            client.release();

            console.log(`✅ Database connected: ${this.config.database}@${this.config.host}`);
        } catch (error) {
            console.error('❌ Database connection failed:', error);
            throw new Error(`Failed to connect to database: ${error}`);
        }
    }

    /**
     * Execute a query
     */
    async query<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
        if (!this.pool) {
            throw new Error('Database not initialized. Call init() first.');
        }

        try {
            const result = await this.pool.query<T>(text, params);
            return result;
        } catch (error) {
            console.error('Query error:', error);
            throw error;
        }
    }

    /**
     * Execute a query and return rows
     */
    async queryRows<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<T[]> {
        const result = await this.query<T>(text, params);
        return result.rows;
    }

    /**
     * Execute a query and return a single row
     */
    async queryOne<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<T | null> {
        const result = await this.query<T>(text, params);
        return result.rows[0] || null;
    }

    /**
     * Begin a transaction
     */
    async beginTransaction(): Promise<PoolClient> {
        if (!this.pool) {
            throw new Error('Database not initialized. Call init() first.');
        }

        const client = await this.pool.connect();
        await client.query('BEGIN');
        return client;
    }

    /**
     * Commit a transaction
     */
    async commitTransaction(client: PoolClient): Promise<void> {
        try {
            await client.query('COMMIT');
        } finally {
            client.release();
        }
    }

    /**
     * Rollback a transaction
     */
    async rollbackTransaction(client: PoolClient): Promise<void> {
        try {
            await client.query('ROLLBACK');
        } finally {
            client.release();
        }
    }

    /**
     * Close all connections in the pool
     */
    async close(): Promise<void> {
        if (this.pool) {
            await this.pool.end();
            console.log('✅ Database pool closed');
        }
    }

    /**
     * Clear all data from a table (use with caution!)
     */
    async truncateTable(tableName: string, cascade: boolean = false): Promise<void> {
        const cascadeStr = cascade ? 'CASCADE' : '';
        await this.query(`TRUNCATE TABLE ${tableName} ${cascadeStr}`);
    }

    /**
     * Check if a table exists
     */
    async tableExists(tableName: string): Promise<boolean> {
        const result = await this.queryOne<{ exists: boolean }>(
            `SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = $1
            )`,
            [tableName]
        );
        return result?.exists || false;
    }

    /**
     * Get row count from a table
     */
    async getRowCount(tableName: string): Promise<number> {
        const result = await this.queryOne<{ count: string }>(
            `SELECT COUNT(*) as count FROM ${tableName}`
        );
        return parseInt(result?.count || '0');
    }

    /**
     * Insert a record and return the inserted row
     */
    async insert<T extends QueryResultRow = any>(tableName: string, data: Record<string, any>): Promise<T> {
        const columns = Object.keys(data);
        const values = Object.values(data);
        const placeholders = columns.map((_, i) => `$${i + 1}`);

        const query = `
            INSERT INTO ${tableName} (${columns.join(', ')})
            VALUES (${placeholders.join(', ')})
            RETURNING *
        `;

        const result = await this.queryOne<T>(query, values);
        if (!result) {
            throw new Error('Insert failed: No row returned');
        }
        return result;
    }

    /**
     * Execute raw SQL from a file
     */
    async executeSqlFile(filePath: string): Promise<void> {
        const fs = require('fs');
        const sql = fs.readFileSync(filePath, 'utf8');
        await this.query(sql);
    }
}
