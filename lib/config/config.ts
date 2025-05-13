import { demo } from "./environments/demo";
import { production } from "./environments/production";

export function getConfig(environment: string = process.env.ENVIRONMENT || 'DEMO'): Config {
    const env = environment.toUpperCase() === 'PRODUCTION' ? production : demo;
    const defaultBaseURL: Config = {
        url: '',
    };

    const config = {
    ...defaultBaseURL
    };

    return { ...config, ...env };
}

const config = getConfig();
export default config;