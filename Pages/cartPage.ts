import { expect, Locator, Page } from "@playwright/test";

export class cartPage {
    readonly page: Page;
    readonly cartItems: Locator;
    readonly cartContinueShoppingButton: Locator;
    readonly removeItemFromCartButton: Locator;
    readonly cartCheckoutButton: Locator;
    constructor(page: Page) {
        this.page = page;
        this.cartItems = page.locator('[data-test="cart-list"]');
        this.cartContinueShoppingButton = page.locator('[data-test="continue-shopping"]');
        this.removeItemFromCartButton = page.locator('[data-test="remove-sauce-labs-backpack"]');
        this.cartCheckoutButton = page.locator('[data-test="checkout"]');
    }
}