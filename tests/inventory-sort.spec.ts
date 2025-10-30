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
  // verify array is sorted according to cmp
  for (let i = 1; i < arr.length; i++) if (cmp(arr[i - 1], arr[i]) > 0) return false;
  return true;
}

test('boots after login', async ({ page }) => {
  // verify inventory list is visible
  await expect(page.locator('.inventory_list')).toBeVisible();
});

test('sort by name A→Z', async ({ page }) => {
  // select sort dropdown A to Z
  const sort = page.locator('select.product_sort_container');
  await sort.selectOption({ value : 'az' });
  // get all item names and verify sorted
  const names = await page.locator('.inventory_item_name').allInnerTexts();
  expect(isSorted(names, (a, b) => a.localeCompare(b))).toBeTruthy();
});

test('sort by name Z→A', async ({ page }) => {
  // select sort dropdown Z to A
  const sort = page.locator('select.product_sort_container');
  await sort.selectOption({ value: 'za' });
  // get all item names and verify sorted
  const names = await page.locator('.inventory_item_name').allInnerTexts();
  expect(isSorted(names, (a, b) => b.localeCompare(a))).toBeTruthy();
});

test('sort by price low→high', async ({ page }) => {
  // select sort dropdown price low to high
  const sort = page.locator('select.product_sort_container');
  await sort.selectOption({ label: 'Price (low to high)' });
  // get all item prices and verify sorted
  const pricesText = await page.locator('.inventory_item_price').allInnerTexts();
  const prices = pricesText.map(text => parseFloat(text.replace('$', '')));
  expect(isSorted(prices, (a, b) => a - b)).toBeTruthy();
});

test('sort by price high→low', async ({ page }) => {
  // select sort dropdown price high to low
  const sort = page.locator('select.product_sort_container');
  await sort.selectOption({ label: 'Price (high to low)' });
  // get all item prices and verify sorted
  const pricesText = await page.locator('.inventory_item_price').allInnerTexts();
  const prices = pricesText.map(text => parseFloat(text.replace('$', '')));
  expect(isSorted(prices, (a, b) => b - a)).toBeTruthy();
});