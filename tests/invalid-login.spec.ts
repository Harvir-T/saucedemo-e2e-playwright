import { test, expect } from '@playwright/test'; 

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  expect(page).toHaveURL(/saucedemo/);
});

test('Username is required error shown on invalid login', async ({ page }) => {
  // leave username blank
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.STANDARD_PASS!);
  await page.getByRole('textbox', { name: 'Username' }).clear();
  await page.getByRole('button', { name: 'Login' }).click();
  // verify error message shown
  const error = page.locator('[data-test="error"]');
  await expect(error).toBeVisible();
  // verify errror message text contains username
  await expect(error).toHaveText('Epic sadface: Username is required');
});

test('Password is required error shown on invalid login', async ({ page }) => {
  // leave password blank
  await page.getByRole('textbox', { name: 'Username' }).fill(process.env.STANDARD_USER!);
  await page.getByRole('textbox', { name: 'Password' }).clear();
  await page.getByRole('button', { name: 'Login' }).click();
  // verify error message shown
  const error = page.locator('[data-test="error"]');
  await expect(error).toBeVisible();
  // verify errror message text contains password
  await expect(error).toHaveText('Epic sadface: Password is required');
});

test('Invalid credentials error shown on invalid login', async ({ page }) => {
  // fill in invalid username and password
  await page.getByRole('textbox', { name: 'Username' }).fill('invalid_user');
  await page.getByRole('textbox', { name: 'Password' }).fill('invalid_pass');
  await page.getByRole('button', { name: 'Login' }).click();
  // verify error message shown
  const error = page.locator('[data-test="error"]');
  await expect(error).toBeVisible();
  // verify errror message text contains invalid credentials
  await expect(error).toHaveText('Epic sadface: Username and password do not match any user in this service');
});

test('Invalid password error shown on invalid login', async ({ page }) => {
  // fill in valid username and invalid password
  await page.getByRole('textbox', { name: 'Username' }).fill(process.env.STANDARD_USER!);
  await page.getByRole('textbox', { name: 'Password' }).fill('invalid_pass');   
  await page.getByRole('button', { name: 'Login' }).click();
  // verify error message shown
  const error = page.locator('[data-test="error"]');
  await expect(error).toBeVisible();
  // verify errror message text contains invalid credentials
  await expect(error).toHaveText('Epic sadface: Username and password do not match any user in this service');
});
