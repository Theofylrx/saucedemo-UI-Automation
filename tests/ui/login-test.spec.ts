import { expect } from "@playwright/test";
import test from "../../lib/helpers/baseTest";
import { user } from "../../lib/models/user";
import { UserType, ErrorMessages, TestDataHelper } from "../../lib/testdata/testDataConstants";

test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
});
test.describe('Login', () => {
    test('with standard user',{tag: ['@critical']}, async ({ loginPage, sideMenu, mainNavigation, inventoryPage, footer }) => {
      const user: user = TestDataHelper.getUser(UserType.STANDARD_USER);
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
      // Twitter icon removed from SauceDemo website
      // await expect(footer.footerTwitter).toBeVisible();
      await expect(footer.footerLinkedin).toBeVisible();
      await expect(mainNavigation.pageHeader).toHaveText('Swag Labs');
      await expect(mainNavigation.cartTitle).toHaveText('Products');
      await expect(inventoryPage.inventoryContainer).toBeVisible();
    });
    test('with locked out user',{tag: ['@critical']}, async ({ loginPage }) => {
      const user: user = TestDataHelper.getUser(UserType.LOCKED_OUT_USER);
      await loginPage.validateLabels();
      await loginPage.Login(user);
      await loginPage.validateErrorBanner();
      await loginPage.validateErrorMessage(ErrorMessages.LOCKED_OUT_USER);
    });
    test.skip('with problem user',{tag: ['@critical']}, async ({ loginPage }) => {
      const user: user = TestDataHelper.getUser(UserType.PROBLEM_USER);
      await loginPage.validateLabels();
      await loginPage.Login(user);
      //TODO: complete the test case
    });
    test.skip('with performance glitch user',{tag: ['@critical']}, async ({ loginPage }) => {
      const user: user = TestDataHelper.getUser(UserType.PERFORMANCE_GLITCH_USER);
      await loginPage.validateLabels();
      await loginPage.Login(user);
      //TODO: complete the test case
    });
    test.skip('with error user',{tag: ['@critical']}, async ({ loginPage }) => {
      const user: user = TestDataHelper.getUser(UserType.ERROR_USER);
      await loginPage.validateLabels();
      await loginPage.Login(user);
      //TODO: complete the test case
    });
    test.skip('with visual user',{tag: ['@critical']}, async ({ loginPage }) => {
      const user: user = TestDataHelper.getUser(UserType.VISUAL_USER);
      await loginPage.validateLabels();
      await loginPage.Login(user);
      //TODO: complete the test case

    });
    test('with empty username and password',{tag: ['@critical']}, async ({ loginPage }) => {
      await loginPage.validateLabels();
      await loginPage.clickLogin();
      await loginPage.validateErrorBanner();
      await loginPage.validateErrorMessage(ErrorMessages.USERNAME_PASSWORD_EMPTY);
    });
    test('with empty username',{tag: ['@critical']}, async ({ loginPage }) => {
      const user: user = TestDataHelper.getUser(UserType.STANDARD_USER);
      await loginPage.validateLabels();
      await loginPage.enterPassword(user.password);
      await loginPage.clickLogin();
      await loginPage.validateErrorBanner();
      await loginPage.validateErrorMessage(ErrorMessages.USERNAME_EMPTY);
    });
    test('with empty password',{tag: ['@critical']}, async ({ loginPage }) => {
      const user: user = TestDataHelper.getUser(UserType.STANDARD_USER);
      await loginPage.validateLabels();
      await loginPage.enterUsername(user.username);
      await loginPage.clickLogin();
      await loginPage.validateErrorBanner();
      await loginPage.validateErrorMessage(ErrorMessages.PASSWORD_EMPTY);
    });
});