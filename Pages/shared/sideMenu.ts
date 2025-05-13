import { expect, Locator, Page } from "@playwright/test";

export class SideMenu {
    readonly page: Page;
    readonly sideMenuOpenBtn: Locator;
    readonly sideMenuCloseBtn: Locator;
    readonly sideMenuInventoryLnk: Locator;
    readonly sideMenuAboutLnk: Locator;
    readonly sideMenuResetAppStateLnk: Locator;
    readonly sideMenuLogoutLnk: Locator;
    constructor(page: Page) {
        this.page = page;
        this.sideMenuOpenBtn = page.getByRole('button', { name: 'Open Menu' });
        this.sideMenuCloseBtn = page.getByRole('button', { name: 'Close Menu' });
        this.sideMenuInventoryLnk = page.locator('[data-test="inventory-sidebar-link"]');
        this.sideMenuAboutLnk = page.locator('[data-test="about-sidebar-link"]');
        this.sideMenuResetAppStateLnk = page.locator('[data-test="reset-sidebar-link"]');
        this.sideMenuLogoutLnk = page.locator('[data-test="logout-sidebar-link"]');
    }
}