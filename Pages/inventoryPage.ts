import { expect, Locator, Page } from "@playwright/test";
import { basePage } from "./basePage";

export class inventoryPage extends basePage {
    readonly page: Page;
    readonly inventoryContainer: Locator;
    readonly productList: Locator;
    readonly itemImg: Locator;
    readonly itemDescription: Locator;
    readonly itemName: Locator;
    readonly itemPrice: Locator;
    readonly addItemToCartButton: Locator;
    readonly removeItemFromCartButton: Locator;
    constructor(page: Page) {
        super(page);
        this.page = page;
        this.inventoryContainer = page.locator('[data-test="inventory-container"]');
        this.productList = page.locator('.inventory_list > .inventory_item');
        this.itemImg = page.locator('img.inventory_item_img');
        this.itemDescription = page.locator('.inventory_item_desc');
        this.itemName = page.locator('.inventory_item_name');
        this.itemPrice = page.locator('.inventory_item_price');
        this.addItemToCartButton = page.getByRole('button', { name: 'Add to cart' });
        this.removeItemFromCartButton = page.getByRole('button', { name: 'Remove' });
    }
    async gotoInventory(): Promise<void> {
        await this.goto('/inventory.html');
    }
    async validateInventoryPageURL(): Promise<void> {
        this.validatePageURL('/inventory.html');
    }
}