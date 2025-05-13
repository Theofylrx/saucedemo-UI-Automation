import { Locator, Page } from "@playwright/test";

export class inventoryPage {
    readonly page: Page;
    readonly inventoryContainer: Locator;
    readonly addItemToCartButton: Locator;
    readonly removeItemFromCartButton: Locator;
    constructor(page: Page) {
        this.page = page;
        this.inventoryContainer = page.locator('[data-test="inventory-container"]');
        this.addItemToCartButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
        this.removeItemFromCartButton = page.locator('[data-test="remove-sauce-labs-backpack"]');
    }
}