import { expect, Locator, Page } from "@playwright/test";
import { basePage } from "./basePage";
export class cartPage extends basePage {
    readonly page: Page;
    readonly cartItems: Locator;
    readonly cartContinueShoppingButton: Locator;
    readonly removeItemFromCartButton: Locator;
    readonly cartCheckoutButton: Locator;
    constructor(page: Page) {
        super(page);
        this.page = page;
        this.cartItems = page.locator('[data-test="cart-list"]');
        this.cartContinueShoppingButton = page.locator('[data-test="continue-shopping"]');
        this.removeItemFromCartButton = page.locator('[data-test="remove-sauce-labs-backpack"]');
        this.cartCheckoutButton = page.locator('[data-test="checkout"]');
    }
    async gotoCart(): Promise<void> {
        await this.goto('/cart.html');
    }
    async validateCartPageURL(): Promise<void> {
        this.validatePageURL('/cart.html');
    }
}