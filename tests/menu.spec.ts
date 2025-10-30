import {test, expect} from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { menu } from '../src/data/menu';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  const login = new LoginPage(page);
  await login.goto();
  await login.login(process.env.STANDARD_USER!, process.env.STANDARD_PASS!);
  await expect(page).toHaveURL(/inventory.html/);
});

test('menu boots after login', async ({ page }) => {
  // ensure menu is present
  const menuButton = page.getByRole('button', { name: 'Open Menu' });
  await expect(menuButton).toBeVisible();
  await menuButton.click();
  // verify menu items are present from data/menu.ts
  for (const item of menu) {
    const menuItem = page.getByText(item.label);
    await expect(menuItem).toBeVisible();
  }
});

test('menu can be closed', async ({page}) => {
    // open the menu
    const menuButton = page.getByRole('button', { name: 'Open Menu' });
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    const menu = page.locator('.bm-menu');
    await expect(menu).toBeVisible();
    // close the menu
    const closeMenuButton = page.getByRole('button', { name: 'Close Menu' });
    await expect(closeMenuButton).toBeVisible();
    await closeMenuButton.click();
    await expect(menu).toBeHidden();
});


test('all items link works', async ({ page }) => {
  // select the first item to navigate away from inventory page
  const firstItem = page.locator('[data-test = "item-4-title-link"]');
  await firstItem.click();
  await expect(page).toHaveURL(/inventory-item\.html/);
  // open the menu
  const menuButton = page.getByRole('button', { name: 'Open Menu' });
  await expect(menuButton).toBeVisible();
  await menuButton.click();
  // click 'All Items'
  const allItemsLink = page.getByText('All Items');
  await expect(allItemsLink).toBeVisible();
  await allItemsLink.click();
  // verify we're back on the inventory page
  await expect(page).toHaveURL(/inventory\.html/);
});


test('about link works', async ({ page }) => {
  // open the menu
  const menuButton = page.getByRole('button', { name: 'Open Menu' });
  await expect(menuButton).toBeVisible();
  await menuButton.click();
  // click 'About'
  const aboutLink = page.getByText('About');
  await expect(aboutLink).toBeVisible();
  await aboutLink.click();
  // verify we're on the about page
  await expect(page).toHaveURL('https://saucelabs.com/');
});

test('logout works from menu', async ({ page }) => {
  // open the menu
  const menuButton = page.getByRole('button', { name: 'Open Menu' });
  await expect(menuButton).toBeVisible();
  await menuButton.click();
  // click logout
  const logoutLink = page.getByText('Logout');
  await expect(logoutLink).toBeVisible();
  await logoutLink.click();
  // verify we're back on the login page
  await expect(page).toHaveTitle('Swag Labs');
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});

test('reset app state works', async ({ page }) => {
  // add an item to the cart
  const addToCartButton = page.getByRole('button', { name: 'Add to cart' }).first();
  await addToCartButton.click();
  // verify cart has 1 item
  const cartBadge = page.locator('.shopping_cart_badge');
  await expect(cartBadge).toHaveText('1');
  // open the menu
  const menuButton = page.getByRole('button', {name: 'Open Menu'});
  await menuButton.click();
  // click 'Reset App State'
  const resetAppStateLink = page.getByText('Reset App State');
  await resetAppStateLink.click();
  // verify cart is empty
  await expect(cartBadge).toHaveCount(0);
});