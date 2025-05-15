import { expect, Locator, Page } from "@playwright/test";
import { basePage } from "./basePage";
export class cartPage extends basePage {
    readonly page: Page;
    readonly cartList: Locator;
    readonly cartItem: Locator;
    readonly cartItemQty: Locator;
    readonly cartQtyLabel: Locator;
    readonly cartDescription: Locator;
    readonly cartContinueShoppingButton: Locator;
    readonly removeItemFromCartButton: Locator;
    readonly cartCheckoutButton: Locator;
    constructor(page: Page) {
        super(page);
        this.page = page;
        this.cartList = page.locator('[data-test="cart-list"]');
        this.cartItem = page.locator('.cart_list > .cart_item');
        this.cartItemQty = page.locator('[data-test="item-quantity"]');
        this.cartQtyLabel = page.locator('[data-test="cart-quantity-label"]');
        this.cartDescription = page.locator('[data-test="cart-desc-label"]');
        this.cartContinueShoppingButton = page.locator('[data-test="continue-shopping"]');
        this.removeItemFromCartButton = page.getByRole('button', { name: 'Remove' });
        this.cartCheckoutButton = page.locator('[data-test="checkout"]');
    }
    async gotoCart(): Promise<void> {
        await this.goto('/cart.html');
    }
    async validateCartPageURL(): Promise<void> {
        this.validatePageURL('/cart.html');
    }
}