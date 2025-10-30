import { test, expect } from '@playwright/test'; 

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  expect(page).toHaveURL(/saucedemo/);
});

test('Username is required error shown on invalid login', async ({ page }) => {
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.STANDARD_PASS!);
  await page.getByRole('textbox', { name: 'Username' }).clear();
  await page.getByRole('button', { name: 'Login' }).click();
  const error = page.locator('[data-test="error"]');
  await expect(error).toBeVisible();
  await expect(error).toHaveText('Epic sadface: Username is required');
});

test('Password is required error shown on invalid login', async ({ page }) => {
  await page.getByRole('textbox', { name: 'Username' }).fill(process.env.STANDARD_USER!);
  await page.getByRole('textbox', { name: 'Password' }).clear();
  await page.getByRole('button', { name: 'Login' }).click();
  const error = page.locator('[data-test="error"]');
  await expect(error).toBeVisible();
  await expect(error).toHaveText('Epic sadface: Password is required');
});

test('Invalid credentials error shown on invalid login', async ({ page }) => {
  await page.getByRole('textbox', { name: 'Username' }).fill('invalid_user');
  await page.getByRole('textbox', { name: 'Password' }).fill('invalid_pass');
  await page.getByRole('button', { name: 'Login' }).click();
  const error = page.locator('[data-test="error"]');
  await expect(error).toBeVisible();
  await expect(error).toHaveText('Epic sadface: Username and password do not match any user in this service');
});

test('Invalid password error shown on invalid login', async ({ page }) => {
  await page.getByRole('textbox', { name: 'Username' }).fill(process.env.STANDARD_USER!);
  await page.getByRole('textbox', { name: 'Password' }).fill('invalid_pass');   
  await page.getByRole('button', { name: 'Login' }).click();
  const error = page.locator('[data-test="error"]');
  await expect(error).toBeVisible();
  await expect(error).toHaveText('Epic sadface: Username and password do not match any user in this service');
});
