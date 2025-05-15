import { expect, Locator, Page } from "@playwright/test";
import { user } from "../lib/models/user";
import { basePage } from "./basePage"; // Adjust the path as needed

export class loginPage extends basePage{
    readonly page: Page;
    readonly pageHeader: Locator;
    readonly loginContainer: Locator;
    readonly usernameTxt: Locator;
    readonly passwordTxt: Locator;
    readonly loginBtn: Locator;
    readonly errorBanner: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.pageHeader = page.getByText('Swag Labs');
        this.loginContainer = page.locator('.login-box');
        this.usernameTxt = page.locator('[data-test="username"]');
        this.passwordTxt = page.locator('[data-test="password"]');
        this.loginBtn = page.locator('[data-test="login-button"]');
        this.errorBanner = page.locator('[data-test="error"]');
    }
    async gotoLogin(): Promise<void> {
        await this.goto();
    }
    async validateLoginPageURL(): Promise<void> {
        this.validatePageURL('/');
    }
    async enterUsername(phone: string): Promise<void>{
        await this.usernameTxt.fill(phone);
    }
    async enterPassword(password: string): Promise<void>{
        await this.passwordTxt.fill(password);
    }
    async clickLogin(): Promise<void>{
        await this.loginBtn.click();
    }
    async validateLabels(): Promise<void>{
        await expect(this.pageHeader).toBeVisible();
        await expect(this.pageHeader).toHaveText('Swag Labs');
        await expect(this.loginContainer).toBeVisible();
        await expect(this.usernameTxt).toBeVisible();
        await expect(this.usernameTxt).toHaveAttribute('placeholder', 'Username');
        await expect(this.usernameTxt).toBeEditable();
        await expect(this.passwordTxt).toBeVisible();
        await expect(this.passwordTxt).toHaveAttribute('placeholder', 'Password');
        await expect(this.passwordTxt).toBeEditable();
        await expect(this.loginBtn).toBeVisible();
        await expect(this.loginBtn).toBeEnabled();
    }
    async Login(userCredentials: user): Promise<string>{
        const user = userCredentials;
        await this.enterUsername(user.username);
        await this.enterPassword(user.password);
        await this.clickLogin();
        return user.username;
    }
    async validateErrorBanner(): Promise<void>{
        await expect(this.errorBanner).toBeVisible();
    }
    async validateErrorMessage(message: string): Promise<void>{
        await expect(this.errorBanner).toHaveText(message);
    }
}