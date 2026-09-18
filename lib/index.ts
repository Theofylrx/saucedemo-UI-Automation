/**
 * QA Automation Platform - Core Test Library
 *
 * This library provides reusable components for test automation:
 * - Page Objects for UI testing
 * - API testing utilities
 * - Database testing utilities
 * - Configuration management
 *
 * @packageDocumentation
 */

// ============================================================================
// Page Objects (UI Testing)
// ============================================================================

export { basePage } from '../Pages/basePage';
export { loginPage } from '../Pages/loginPage';
export { inventoryPage } from '../Pages/inventoryPage';
export { cartPage } from '../Pages/cartPage';
export { checkoutPage } from '../Pages/checkoutPage';

// Shared Components
export { sideMenu } from '../Pages/shared-components/sideMenu';
export { footer } from '../Pages/shared-components/footer';
export { mainNavigation } from '../Pages/shared-components/mainNavigation';

// ============================================================================
// API Testing
// ============================================================================

export { ApiClient } from './api/clients/apiClient';
export { apiTest, expect as apiExpect } from './api/helpers/apiBaseTest';
export type {
    ApiResponse,
    User,
    Address,
    Company,
    Post,
    Order,
    OrderProduct,
    Product,
    ApiError,
} from './api/models/apiModels';
export { OrderStatus as ApiOrderStatus } from './api/models/apiModels';

// ============================================================================
// Database Testing
// ============================================================================

export { DbClient } from './database/clients/dbClient';
export { dbTest, expect as dbExpect } from './database/helpers/dbBaseTest';
export { OrderQueries } from './database/queries/orderQueries';
export type {
    DbUser,
    DbOrder,
    DbOrderItem,
    DbProduct,
    DbSession,
} from './database/models/dbModels';
export { OrderStatus as DbOrderStatus } from './database/models/dbModels';

// ============================================================================
// Configuration
// ============================================================================

export { getConfig } from './config/config';
export type { Config } from './models/config';
export { demo } from './config/environments/demo';
export { production } from './config/environments/production';
export * from './config/mcpConfig';

// ============================================================================
// Test Helpers & Fixtures
// ============================================================================

export { default as baseTest } from './helpers/baseTest';

// ============================================================================
// Utilities
// ============================================================================

export * from './utils/utils';

// ============================================================================
// Models
// ============================================================================

export type { user } from './models/user';
