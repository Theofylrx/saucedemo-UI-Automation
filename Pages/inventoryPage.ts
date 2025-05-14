import { expect, Locator, Page } from "@playwright/test";
import { basePage } from "./basePage";

export class inventoryPage extends basePage {
    readonly page: Page;
    readonly inventoryContainer: Locator;
    readonly addItemToCartButton: Locator;
    readonly removeItemFromCartButton: Locator;
    constructor(page: Page) {
        super(page);
        this.page = page;
        this.inventoryContainer = page.locator('[data-test="inventory-container"]');
        this.addItemToCartButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
        this.removeItemFromCartButton = page.locator('[data-test="remove-sauce-labs-backpack"]');
    }
    async gotoInventory(): Promise<void> {
        await this.goto('/inventory.html');
    }
    async validateInventoryPageURL(): Promise<void> {
        this.validatePageURL('/inventory.html');
    }
}