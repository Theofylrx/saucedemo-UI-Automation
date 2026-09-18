/**
 * Model Context Protocol (MCP) Configuration
 * Enables LLMs to interact with the test framework during test execution
 */

export interface MCPConfig {
    enabled: boolean;
    serverUrl?: string;
    apiKey?: string;
    capabilities: MCPCapabilities;
}

export interface MCPCapabilities {
    navigation: boolean;
    interaction: boolean;
    screenshot: boolean;
    assertion: boolean;
    apiTesting: boolean;
    databaseQuery: boolean;
}

export const defaultMCPConfig: MCPConfig = {
    enabled: process.env.MCP_ENABLED === 'true',
    serverUrl: process.env.MCP_SERVER_URL,
    apiKey: process.env.MCP_API_KEY,
    capabilities: {
        navigation: true,
        interaction: true,
        screenshot: true,
        assertion: true,
        apiTesting: true,
        databaseQuery: false, // Disabled by default for security
    },
};

/**
 * Test Agents Configuration
 * Configuration for AI-powered test agents that can assist with test execution
 */
export interface TestAgentsConfig {
    enabled: boolean;
    model: string;
    endpoint?: string;
    features: TestAgentFeatures;
}

export interface TestAgentFeatures {
    autoHealing: boolean; // Automatically fix broken selectors
    smartWaits: boolean; // Intelligent wait strategies
    testGeneration: boolean; // Generate test suggestions
    errorAnalysis: boolean; // Analyze and suggest fixes for failures
}

export const defaultTestAgentsConfig: TestAgentsConfig = {
    enabled: process.env.AGENTS_ENABLED === 'true',
    model: process.env.AGENT_MODEL || 'claude-3-sonnet',
    endpoint: process.env.AGENT_ENDPOINT,
    features: {
        autoHealing: false, // Disabled by default
        smartWaits: true,
        testGeneration: false,
        errorAnalysis: true,
    },
};
