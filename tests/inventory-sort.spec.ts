import {test, expect} from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  const login = new LoginPage(page);
  await login.goto();
  await login.login(process.env.STANDARD_USER!, process.env.STANDARD_PASS!);
  await expect(page).toHaveURL(/inventory.html/);
});

function isSorted<T>(arr: T[], cmp: (a: T, b: T) => number) {
  for (let i = 1; i < arr.length; i++) if (cmp(arr[i - 1], arr[i]) > 0) return false;
  return true;
}

test('boots after login', async ({ page }) => {
  await expect(page.locator('.inventory_list')).toBeVisible();
});

test('sort by name A→Z', async ({ page }) => {
  const sort = page.locator('select.product_sort_container');
  await sort.selectOption({ value : 'az' });
  const names = await page.locator('.inventory_item_name').allInnerTexts();
  expect(isSorted(names, (a, b) => a.localeCompare(b))).toBeTruthy();
});

test('sort by name Z→A', async ({ page }) => {
  const sort = page.locator('select.product_sort_container');
  await sort.selectOption({ value: 'za' });
  const names = await page.locator('.inventory_item_name').allInnerTexts();
  expect(isSorted(names, (a, b) => b.localeCompare(a))).toBeTruthy();
});

test('sort by price low→high', async ({ page }) => {
  const sort = page.locator('select.product_sort_container');
  await sort.selectOption({ label: 'Price (low to high)' });
  const pricesText = await page.locator('.inventory_item_price').allInnerTexts();
  const prices = pricesText.map(text => parseFloat(text.replace('$', '')));
  expect(isSorted(prices, (a, b) => a - b)).toBeTruthy();
});

test('sort by price high→low', async ({ page }) => {
  const sort = page.locator('select.product_sort_container');
  await sort.selectOption({ label: 'Price (high to low)' });
  const pricesText = await page.locator('.inventory_item_price').allInnerTexts();
  const prices = pricesText.map(text => parseFloat(text.replace('$', '')));
  expect(isSorted(prices, (a, b) => b - a)).toBeTruthy();
});