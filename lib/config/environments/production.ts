import { Config } from "../../models/config";

export const production: Config = {
    url: process.env.PRODUCTION_URL || 'https://saucelabs.com/',
    apiUrl: process.env.API_BASE_URL || 'https://api.production.example.com',
    databaseUrl: process.env.DATABASE_URL || 'postgresql://produser:prodpass@prod-db:5432/proddb',
}