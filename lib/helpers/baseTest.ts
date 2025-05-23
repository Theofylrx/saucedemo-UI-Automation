import { test as baseTest } from '@playwright/test';
import { basePage } from '../../Pages/basePage';
import { loginPage } from '../../Pages/loginPage';
import { inventoryPage } from '../../Pages/inventoryPage';
import { cartPage } from '../../Pages/cartPage';
import { checkoutPage } from '../../Pages/checkoutPage';
import { sideMenu } from '../../Pages/shared-components/sideMenu';
import { footer } from '../../Pages/shared-components/footer';
import { mainNavigation } from '../../Pages/shared-components/mainNavigation';

type myFixtures = {
  basePage: basePage;
  loginPage: loginPage;
  inventoryPage: inventoryPage;
  cartPage: cartPage;
  checkoutPage: checkoutPage;
  sideMenu: sideMenu;
  footer: footer;
  mainNavigation: mainNavigation;
}

const test = baseTest.extend<myFixtures>({
    basePage: async ({ page }, use) => {
        await use(new basePage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new loginPage(page));
    },
    inventoryPage: async ({ page }, use) => {
        await use(new inventoryPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new cartPage(page));
    },
    checkoutPage: async ({ page }, use) => {
        await use(new checkoutPage(page));
    },
    sideMenu: async ({ page }, use) => {
        await use(new sideMenu(page));
    },
    footer: async ({ page }, use) => {
        await use(new footer(page));
    },
    mainNavigation: async ({ page }, use) => {
        await use(new mainNavigation(page));
    },
});

export default test;