import { Config } from "../../models/config";

export const demo: Config = {
    url: process.env.DEMO_URL || 'https://www.saucedemo.com/',
}