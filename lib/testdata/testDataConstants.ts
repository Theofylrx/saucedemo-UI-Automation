/**
 * Test Data Constants and Enums
 *
 * Provides type-safe access to test data from testdata.json
 * Eliminates magic strings and provides IDE autocomplete support
 */

import { saucedemoTestdata } from './testdata.json';
import { user } from '../models/user';

/**
 * User Account Types
 * Maps to saucedemoTestdata.account keys
 */
export enum UserType {
    STANDARD_USER = 'standard_user',
    LOCKED_OUT_USER = 'locked_out_user',
    PROBLEM_USER = 'problem_user',
    PERFORMANCE_GLITCH_USER = 'performance_glitch_user',
    ERROR_USER = 'error_user',
    VISUAL_USER = 'visual_user',
}

/**
 * Checkout User Types
 * Maps to saucedemoTestdata.checkout["valid-users"] keys
 */
export enum CheckoutUser {
    JOHN_DOE = 'john-doe',
    JANE_DOE = 'jane-doe',
    INVALID_USER = 'invalid-user',
}

/**
 * Error Messages Constants
 * Type-safe access to all error messages
 */
export const ErrorMessages = {
    LOCKED_OUT_USER: saucedemoTestdata.errors.locked_out_user,
    PROBLEM_USER: saucedemoTestdata.errors.problem_user,
    PERFORMANCE_GLITCH_USER: saucedemoTestdata.errors.performance_glitch_user,
    ERROR_USER: saucedemoTestdata.errors.error_user,
    VISUAL_USER: saucedemoTestdata.errors.visual_user,
    USERNAME_EMPTY: saucedemoTestdata.errors.username_empty,
    PASSWORD_EMPTY: saucedemoTestdata.errors.password_empty,
    USERNAME_PASSWORD_EMPTY: saucedemoTestdata.errors.username_password_empty,
} as const;

/**
 * Checkout User Data Type
 */
export type CheckoutUserData = {
    firstName: string;
    lastName: string;
    postalCode: string;
};

/**
 * Helper Functions for Type-Safe Test Data Access
 */
export class TestDataHelper {
    /**
     * Get user credentials by user type
     * @param userType - The type of user to retrieve
     * @returns User credentials (username and password)
     *
     * @example
     * const user = TestDataHelper.getUser(UserType.STANDARD_USER);
     * await loginPage.Login(user);
     */
    static getUser(userType: UserType): user {
        return saucedemoTestdata.account[userType];
    }

    /**
     * Get checkout user data
     * @param checkoutUser - The checkout user type to retrieve
     * @returns Checkout user data (firstName, lastName, postalCode)
     *
     * @example
     * const checkout = TestDataHelper.getCheckoutUser(CheckoutUser.JOHN_DOE);
     * await checkoutPage.fillForm(checkout.firstName, checkout.lastName, checkout.postalCode);
     */
    static getCheckoutUser(checkoutUser: CheckoutUser): CheckoutUserData {
        if (checkoutUser === CheckoutUser.INVALID_USER) {
            return saucedemoTestdata.checkout['invalid-user'];
        }
        return saucedemoTestdata.checkout['valid-users'][checkoutUser];
    }

    /**
     * Get error message by type
     * @param errorKey - Key from ErrorMessages constant
     * @returns The error message string
     *
     * @example
     * const errorMsg = TestDataHelper.getErrorMessage(ErrorMessages.LOCKED_OUT_USER);
     * await loginPage.validateErrorMessage(errorMsg);
     */
    static getErrorMessage(errorMessage: string): string {
        return errorMessage;
    }
}

/**
 * Direct Export for Backward Compatibility
 * Allows both old and new patterns to coexist during migration
 */
export const TestData = {
    users: {
        standardUser: saucedemoTestdata.account.standard_user,
        lockedOutUser: saucedemoTestdata.account.locked_out_user,
        problemUser: saucedemoTestdata.account.problem_user,
        performanceGlitchUser: saucedemoTestdata.account.performance_glitch_user,
        errorUser: saucedemoTestdata.account.error_user,
        visualUser: saucedemoTestdata.account.visual_user,
    },
    checkout: {
        johnDoe: saucedemoTestdata.checkout['valid-users']['john-doe'],
        janeDoe: saucedemoTestdata.checkout['valid-users']['jane-doe'],
        invalidUser: saucedemoTestdata.checkout['invalid-user'],
    },
    errors: ErrorMessages,
} as const;
