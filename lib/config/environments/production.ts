import { Config } from "../../models/config";

export const production: Config = {
    url: process.env.PRODUCTION_URL || 'https://saucelabs.com/',
}