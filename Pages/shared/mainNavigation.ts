import { expect, Locator, Page } from "@playwright/test";

export class mainNavigation {
    readonly page: Page;
    readonly pageHeader: Locator;
    readonly pageSecondHeader: Locator;
    readonly cartBtn: Locator;
    readonly cartTitle: Locator;
    constructor(page: Page) {
        this.page = page;
        this.pageHeader = page.locator('[data-test="primary-header"] div').filter({ hasText: 'Swag Labs' });
        this.pageSecondHeader = page.locator('[data-test="secondary-header"]');
        this.cartBtn = page.locator('[data-test="shopping-cart-link"]');
        this.cartTitle = page.locator('[data-test="title"]');
    }
}