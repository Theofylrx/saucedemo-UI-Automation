import test from "../lib/helpers/basetest";

test.beforeEach(async ({ basePage }) => {
    await basePage.goto();
  });
test.describe('Login', () => {
    test('with standard user',{tag: ['@critical']}, async () => {
    });
    test('with locked out user',{tag: ['@critical']}, async () => {
    });
});