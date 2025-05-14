import { expect, Locator, Page } from "@playwright/test";

export class footer {
    readonly page: Page;
    readonly footer: Locator;
    readonly footerTwitter: Locator;
    readonly footerFacebook: Locator;
    readonly footerLinkedin: Locator;
    readonly footerCopyRight: Locator;

    constructor(page: Page) {
        this.page = page;
        this.footer = page.locator('[data-test="footer"]');
        this.footerTwitter = page.locator('[data-test="social-twitter"]');
        this.footerFacebook = page.locator('[data-test="social-facebook"]');
        this.footerLinkedin = page.locator('[data-test="social-linkedin"]');
        this.footerCopyRight = page.locator('[data-test="footer-copy"]');
    }
}