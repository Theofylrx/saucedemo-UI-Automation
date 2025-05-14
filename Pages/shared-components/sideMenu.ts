import { expect, Locator, Page } from "@playwright/test";

export class sideMenu {
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
    async clickSideMenuOpenBtn(): Promise<void> {
        await this.sideMenuOpenBtn.click();
    }
    async clickSideMenuCloseBtn(): Promise<void> {
        await this.sideMenuCloseBtn.click();
    }
    async clickSideMenuInventoryLnk(): Promise<void> {
        await this.sideMenuInventoryLnk.click();
    }
    async clickSideMenuAboutLnk(): Promise<void> {
        await this.sideMenuAboutLnk.click();
    }
    async clickSideMenuResetAppStateLnk(): Promise<void> {
        await this.sideMenuResetAppStateLnk.click();
    }
    async clickSideMenuLogoutLnk(): Promise<void> {
        await this.sideMenuLogoutLnk.click();
    }
}