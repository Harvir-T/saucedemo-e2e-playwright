import {test, expect} from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';

test('login to inventory < threshold', async ({ page }) => {
    // go to login page
    const login = new LoginPage(page);
    await page.goto('/');
    // fill in login details
    await page.getByRole('textbox', { name: 'Username' }).fill(process.env.STANDARD_USER!);
    await page.getByRole('textbox', { name: 'Password' }).fill(process.env.STANDARD_PASS!);
    // get start time
    const start = Date.now();
    // click login
    await page.getByRole('button', { name: 'Login' }).click();
    // wait for inventory page to load
    await expect(page).toHaveURL(/inventory\.html/);
    // get end time
    const end = Date.now();
    const duration = end - start;
    console.log(`Login took ${duration} ms`);
    expect(duration).toBeLessThan(Number(process.env.PERF_MAX_LOGIN_MS));
});

test('sort items < threshold', async ({ page }) => {
    // login first
    const login = new LoginPage(page);
    await page.goto('/');
    await login.login(process.env.STANDARD_USER!, process.env.STANDARD_PASS!);
    await expect(page).toHaveURL(/inventory\.html/);
    // get start time
    const start = Date.now();
    // perform sort
    const sortSelect = page.locator('.product_sort_container');
    await sortSelect.selectOption('hilo');
    // wait for sort to complete - verify first item is the most expensive
    const firstItem = page.locator('.inventory_item').first();
    await expect(firstItem.getByText('Sauce Labs Fleece Jacket')).toBeVisible();
    // get end time
    const end = Date.now();
    const duration = end - start;
    console.log(`Sorting took ${duration} ms`);
    expect(duration).toBeLessThan(Number(process.env.PERF_MAX_SORT_MS));
});
