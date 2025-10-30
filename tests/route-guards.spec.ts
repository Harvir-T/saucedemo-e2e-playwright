import {test, expect} from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // ensure we're logged out
    await expect(page).toHaveURL(/saucedemo/);
});

test('cannot access cart page when not logged in', async ({ page }) => {
    // try to navigate to cart page
    await page.goto('/cart.html');
    // verify we're back on login page
    await expect(page).toHaveURL(/saucedemo/);
});

test('cannot access product details page when not logged in', async ({ page }) => {
    // try to navigate to a product details page
    await page.goto('/inventory-item.html?id=4');
    // verify we're back on login page
    await expect(page).toHaveURL(/saucedemo/);
});
