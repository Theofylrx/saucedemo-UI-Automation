import { expect } from "@playwright/test";
import test from "../lib/helpers/baseTest";
import { user } from "../lib/models/user";
import { saucedemoTestdata } from "../lib/testdata/testdata.json";

test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
});
test.describe('Login', () => {
    test('with standard user',{tag: ['@critical']}, async ({ loginPage, sideMenu, mainNavigation, inventoryPage, footer }) => {
      const user: user = saucedemoTestdata.account.standard_user;
      await loginPage.validateLabels();
      const loggedInUser: string = await loginPage.Login(user);
      await inventoryPage.validateInventoryPageURL();
      await expect(sideMenu.sideMenuOpenBtn).toBeVisible();
      await expect(mainNavigation.pageHeader).toBeVisible();
      await expect(mainNavigation.pageSecondHeader).toBeVisible();
      await expect(mainNavigation.cartTitle).toBeVisible();
      await expect(mainNavigation.cartBtn).toBeVisible();
      await expect(footer.footer).toBeVisible();
      await expect(footer.footerCopyRight).toBeVisible();
      await expect(footer.footerFacebook).toBeVisible();
      await expect(footer.footerTwitter).toBeVisible();
      await expect(footer.footerLinkedin).toBeVisible();
      await expect(mainNavigation.pageHeader).toHaveText('Swag Labs');
      await expect(mainNavigation.cartTitle).toHaveText('Products');
      await expect(inventoryPage.inventoryContainer).toBeVisible();
    });
    test('with locked out user',{tag: ['@critical']}, async ({ loginPage }) => {
      const user: user = saucedemoTestdata.account.locked_out_user;
      await loginPage.validateLabels();
      await loginPage.Login(user);
      await loginPage.validateErrorBanner();
      await loginPage.validateErrorMessage(saucedemoTestdata.errors.locked_out_user);
    });
    test.skip('with problem user',{tag: ['@critical']}, async ({ loginPage }) => {
      const user: user = saucedemoTestdata.account.problem_user;
      await loginPage.validateLabels();
      await loginPage.Login(user);
      //TODO: complete the test case
    });
    test.skip('with performance glitch user',{tag: ['@critical']}, async ({ loginPage }) => {
      const user: user = saucedemoTestdata.account.performance_glitch_user;
      await loginPage.validateLabels();
      await loginPage.Login(user);
      //TODO: complete the test case
    });
    test.skip('with error user',{tag: ['@critical']}, async ({ loginPage }) => {
      const user: user = saucedemoTestdata.account.error_user;
      await loginPage.validateLabels();
      await loginPage.Login(user);
      //TODO: complete the test case
    });
    test.skip('with visual user',{tag: ['@critical']}, async ({ loginPage }) => {
      const user: user = saucedemoTestdata.account.visual_user;
      await loginPage.validateLabels();
      await loginPage.Login(user);
      //TODO: complete the test case
      
    });
    test('with empty username and password',{tag: ['@critical']}, async ({ loginPage }) => {
      await loginPage.validateLabels();
      await loginPage.clickLogin();
      await loginPage.validateErrorBanner();
      await loginPage.validateErrorMessage(saucedemoTestdata.errors.username_password_empty);
    });
    test('with empty username',{tag: ['@critical']}, async ({ loginPage }) => {
      const user: user = saucedemoTestdata.account.standard_user;
      await loginPage.validateLabels();
      await loginPage.enterPassword(user.password);
      await loginPage.clickLogin();
      await loginPage.validateErrorBanner();
      await loginPage.validateErrorMessage(saucedemoTestdata.errors.username_empty);
    });
    test('with empty password',{tag: ['@critical']}, async ({ loginPage }) => {
      const user: user = saucedemoTestdata.account.standard_user;
      await loginPage.validateLabels();
      await loginPage.enterUsername(user.username);
      await loginPage.clickLogin();
      await loginPage.validateErrorBanner();
      await loginPage.validateErrorMessage(saucedemoTestdata.errors.password_empty);
    });
});