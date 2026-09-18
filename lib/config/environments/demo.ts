import { Config } from "../../models/config";

export const demo: Config = {
    url: process.env.DEMO_URL || 'https://www.saucedemo.com/',
    apiUrl: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
    databaseUrl: process.env.DATABASE_URL || 'postgresql://testuser:testpass@localhost:5432/testdb',
}