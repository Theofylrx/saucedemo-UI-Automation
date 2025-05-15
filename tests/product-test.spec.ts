import { expect } from "@playwright/test";
import test from "../lib/helpers/baseTest";
import { user } from "../lib/models/user";
import { saucedemoTestdata } from "../lib/testdata/testdata.json";
import { getRandomNumber } from "../lib/utils/utils";

test.beforeEach(async ({ loginPage }) => {
    const user: user = saucedemoTestdata.account.standard_user;
    await loginPage.goto();
    const loggedInUser: string = await loginPage.Login(user);
});

test.describe('Product list', () => {
    test('loads correctly after login.', { tag: ['@critical'] }, async ({ inventoryPage }) => {
        for (let i = 0; i < await inventoryPage.productList.count(); i++) {
            const product = inventoryPage.productList.nth(i);
            await expect(product.locator(inventoryPage.itemImg)).toBeVisible();
            expect(product.locator(inventoryPage.itemImg)).not.toBeNull();
            await expect(product.locator(inventoryPage.itemName)).toBeVisible();
            expect(product.locator(inventoryPage.itemName)).not.toBeNull();
            await expect(product.locator(inventoryPage.itemDescription)).toBeVisible();
            expect(product.locator(inventoryPage.itemDescription)).not.toBeNull();
            await expect(product.locator(inventoryPage.itemPrice)).toBeVisible();
            expect(product.locator(inventoryPage.itemPrice)).not.toBeNull();
            await expect(product.locator(inventoryPage.addItemToCartButton)).toBeVisible();
            await expect(product.locator(inventoryPage.addItemToCartButton)).toBeEnabled();
        }
    });
    test('validate number of products displayed', { tag: ['@critical'] }, async ({ inventoryPage }) => {
        await expect(inventoryPage.productList).toHaveCount(6);
    });
});

test.describe('Cart', () => {
    test('add item to cart and remove item from the cart', { tag: ['@critical'] }, async ({ inventoryPage, mainNavigation, cartPage }) => {
        const itemIndex: number = getRandomNumber(await inventoryPage.productList.count());
        const product = inventoryPage.productList.nth(itemIndex);
        await product.locator(inventoryPage.addItemToCartButton).click();
        await expect(product.locator(inventoryPage.removeItemFromCartButton)).toBeVisible();
        await expect(product.locator(inventoryPage.removeItemFromCartButton)).toBeEnabled();
        await mainNavigation.navigateToCart();
        await expect(mainNavigation.cartTitle).toHaveText('Your Cart');
        await expect(cartPage.cartList).toBeVisible();
        await expect(cartPage.cartQtyLabel).toBeVisible();
        await expect(cartPage.cartDescription).toBeVisible();
        for (let i = 0; i < await cartPage.cartItem.count(); i++) {
            const item = cartPage.cartItem.nth(i);
            await expect(item.locator(cartPage.cartItemQty)).toBeVisible();
            expect(item.locator(cartPage.cartItemQty)).not.toBeNull();
            await expect(item.locator(cartPage.cartItemQty)).toHaveText('1');
            await expect(item.locator(inventoryPage.itemName)).toBeVisible();
            expect(item.locator(inventoryPage.itemName)).not.toBeNull();
            await expect(item.locator(inventoryPage.itemDescription)).toBeVisible();
            expect(item.locator(inventoryPage.itemDescription)).not.toBeNull();
            await expect(item.locator(inventoryPage.itemPrice)).toBeVisible();
            expect(item.locator(inventoryPage.itemPrice)).not.toBeNull();
            await expect(item.locator(cartPage.removeItemFromCartButton)).toBeVisible();
            await expect(item.locator(cartPage.removeItemFromCartButton)).toBeEnabled();
            await cartPage.removeItemFromCartButton.click();
        }
        expect(cartPage.cartItem).toHaveCount(0);
        expect(cartPage.cartItem).not.toBeVisible();
        await expect(cartPage.cartContinueShoppingButton).toBeVisible();
        await expect(cartPage.cartContinueShoppingButton).toBeEnabled();
        await expect(cartPage.cartCheckoutButton).toBeVisible();
        await expect(cartPage.cartCheckoutButton).toBeEnabled();
    });
    test('checkout', { tag: ['@critical'] }, async ({ inventoryPage, mainNavigation, cartPage, checkoutPage }) => {
        const itemIndex: number = getRandomNumber(await inventoryPage.productList.count());
        const product = inventoryPage.productList.nth(itemIndex);
        await product.locator(inventoryPage.addItemToCartButton).click();
        await mainNavigation.navigateToCart();
        await cartPage.cartCheckoutButton.click();
        await checkoutPage.validateCheckoutStepOnePageURL();
        await expect(mainNavigation.cartTitle).toHaveText('Checkout: Your Information');
        await expect(checkoutPage.checkoutFirstName).toBeVisible();
        await expect(checkoutPage.checkoutFirstName).toBeEnabled();
        await expect(checkoutPage.checkoutFirstName).toBeEditable();
        await expect(checkoutPage.checkoutLastName).toBeVisible();
        await expect(checkoutPage.checkoutLastName).toBeEnabled();
        await expect(checkoutPage.checkoutLastName).toBeEditable();
        await expect(checkoutPage.checkoutPostalCode).toBeVisible();
        await expect(checkoutPage.checkoutPostalCode).toBeEnabled();
        await expect(checkoutPage.checkoutPostalCode).toBeEditable();
        await expect(checkoutPage.checkoutContinueButton).toBeVisible();
        await expect(checkoutPage.checkoutContinueButton).toBeEnabled();
        await expect(checkoutPage.checkoutCancelButton).toBeVisible();
        await expect(checkoutPage.checkoutCancelButton).toBeEnabled();
        await checkoutPage.checkoutFirstName.fill(saucedemoTestdata.checkout["valid-users"]["john-doe"].firstName);
        await checkoutPage.checkoutLastName.fill(saucedemoTestdata.checkout["valid-users"]["john-doe"].lastName);
        await checkoutPage.checkoutPostalCode.fill(saucedemoTestdata.checkout["valid-users"]["john-doe"].postalCode);
        await checkoutPage.checkoutContinueButton.click();
        await checkoutPage.validateCheckoutStepTwoPageURL();
        await expect(mainNavigation.cartTitle).toHaveText('Checkout: Overview');
        await expect(cartPage.cartList).toBeVisible();
        await expect(cartPage.cartQtyLabel).toBeVisible();
        await expect(cartPage.cartDescription).toBeVisible();
        for (let i = 0; i < await cartPage.cartItem.count(); i++) {
            const item = cartPage.cartItem.nth(i);
            await expect(item.locator(cartPage.cartItemQty)).toBeVisible();
            expect(item.locator(cartPage.cartItemQty)).not.toBeNull();
            await expect(item.locator(cartPage.cartItemQty)).toHaveText('1');
            await expect(item.locator(inventoryPage.itemName)).toBeVisible();
            expect(item.locator(inventoryPage.itemName)).not.toBeNull();
            await expect(item.locator(inventoryPage.itemDescription)).toBeVisible();
            expect(item.locator(inventoryPage.itemDescription)).not.toBeNull();
            await expect(item.locator(inventoryPage.itemPrice)).toBeVisible();
            expect(item.locator(inventoryPage.itemPrice)).not.toBeNull();
        }
        await expect(checkoutPage.paymentInfoLabel).toBeVisible();
        await expect(checkoutPage.paymentInfoLabel).toHaveText('Payment Information:');
        await expect(checkoutPage.paymentInfoValue).toBeVisible();
        await expect(checkoutPage.paymentInfoValue).toContainText('SauceCard');
        await expect(checkoutPage.shippingInfoLabel).toBeVisible();
        await expect(checkoutPage.shippingInfoLabel).toHaveText('Shipping Information:');
        await expect(checkoutPage.shippingInfoValue).toBeVisible();
        await expect(checkoutPage.shippingInfoValue).toHaveText('Free Pony Express Delivery!');
        await expect(checkoutPage.subTotalInfoLabel).toBeVisible();
        await expect(checkoutPage.subTotalInfoLabel).toContainText('Item total:');
        await expect(checkoutPage.taxInfoLabel).toBeVisible();
        await expect(checkoutPage.taxInfoLabel).toContainText('Tax:');
        await expect(checkoutPage.totalInfoLabel).toBeVisible();
        await expect(checkoutPage.totalInfoLabel).toContainText('Price Total');
        await expect(checkoutPage.totalLabel).toBeVisible();
        await expect(checkoutPage.totalLabel).toContainText('Total:');
        await expect(checkoutPage.finishButton).toBeVisible();
        await expect(checkoutPage.finishButton).toBeEnabled();
        await expect(checkoutPage.checkoutCancelButton).toBeVisible();
        await expect(checkoutPage.checkoutCancelButton).toBeEnabled();
        await checkoutPage.finishButton.click();
        await checkoutPage.validateCheckoutCompletePageURL();
        await expect(checkoutPage.checkoutCompleteIcon).toBeVisible();
        await expect(checkoutPage.checkoutHeader).toBeVisible();
        await expect(checkoutPage.checkoutHeader).toHaveText('Thank you for your order!');
        await expect(checkoutPage.checkoutCompleteText).toBeVisible();
        await expect(checkoutPage.checkoutCompleteText).toHaveText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
        await expect(checkoutPage.checkoutBackHomeButton).toBeVisible();
        await expect(checkoutPage.checkoutBackHomeButton).toBeEnabled();
    });
});