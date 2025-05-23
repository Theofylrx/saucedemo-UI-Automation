import { expect, Locator, Page } from "@playwright/test";
import { basePage } from "./basePage";

export class checkoutPage extends basePage {
    readonly page: Page;
    readonly checkoutInfo: Locator;
    readonly checkoutFirstName: Locator;
    readonly checkoutLastName: Locator;
    readonly checkoutPostalCode: Locator;
    readonly checkoutContinueButton: Locator;
    readonly checkoutCancelButton: Locator;
    readonly checkoutErrorMessage: Locator;
    readonly checkoutListItems: Locator;
    readonly paymentInfoLabel: Locator;
    readonly paymentInfoValue: Locator;
    readonly shippingInfoLabel: Locator;
    readonly shippingInfoValue: Locator;
    readonly totalInfoLabel: Locator;
    readonly subTotalInfoLabel: Locator;
    readonly taxInfoLabel: Locator;
    readonly totalLabel: Locator;
    readonly finishButton: Locator;
    readonly checkoutCompleteIcon: Locator;
    readonly checkoutHeader: Locator;
    readonly checkoutCompleteText: Locator;
    readonly checkoutBackHomeButton: Locator;
    constructor(page: Page) {
        super(page);
        this.page = page;
        this.checkoutInfo = page.locator('.checkout_info');
        this.checkoutFirstName = page.locator('[data-test="firstName"]');
        this.checkoutLastName = page.locator('[data-test="lastName"]');
        this.checkoutPostalCode = page.locator('[data-test="postalCode"]');
        this.checkoutContinueButton = page.locator('[data-test="continue"]');
        this.checkoutCancelButton = page.locator('[data-test="cancel"]');
        this.checkoutErrorMessage = page.locator('.error-message-container');
        this.checkoutListItems = page.locator('[data-test="cart-list"]');
        this.paymentInfoLabel = page.locator('[data-test="payment-info-label"]');
        this.paymentInfoValue = page.locator('[data-test="payment-info-value"]');
        this.shippingInfoLabel = page.locator('[data-test="shipping-info-label"]');
        this.shippingInfoValue = page.locator('[data-test="shipping-info-value"]');
        this.totalInfoLabel = page.locator('[data-test="total-info-label"]');
        this.subTotalInfoLabel = page.locator('[data-test="subtotal-label"]');
        this.taxInfoLabel = page.locator('[data-test="tax-label"]');
        this.totalLabel = page.locator('[data-test="total-label"]');
        this.finishButton = page.locator('[data-test="finish"]');
        this.checkoutCompleteIcon = page.locator('[data-test="pony-express"]');
        this.checkoutHeader = page.locator('[data-test="complete-header"]');
        this.checkoutCompleteText = page.locator('[data-test="complete-text"]');
        this.checkoutBackHomeButton = page.locator('[data-test="back-to-products"]');
    }
    async gotoCheckoutStepOne(): Promise<void> {
        await this.goto('/checkout-step-one.html');
    }
    async gotoCheckoutStepTwo(): Promise<void> {
        await this.goto('/checkout-step-two.html');
    }
    async gotoCheckoutComplete(): Promise<void> {
        await this.goto('/checkout-complete.html');
    }
    async validateCheckoutStepOnePageURL(): Promise<void> {
        this.validatePageURL('/checkout-step-one.html');
    }
    async validateCheckoutStepTwoPageURL(): Promise<void> {
        this.validatePageURL('/checkout-step-two.html');
    }
    async validateCheckoutCompletePageURL(): Promise<void> {
        this.validatePageURL('/checkout-complete.html');
    }
    async enterFirstName(firstName: string): Promise<void> {
        await this.checkoutFirstName.fill(firstName);
    }
    async enterLastName(lastName: string): Promise<void> {
        await this.checkoutLastName.fill(lastName);
    }
    async enterPostalCode(postalCode: string): Promise<void> {
        await this.checkoutPostalCode.fill(postalCode);
    }
    async clickContinue(): Promise<void> {
        await this.checkoutContinueButton.click();
    }
    async clickCancel(): Promise<void> {
        await this.checkoutCancelButton.click();
    }
}