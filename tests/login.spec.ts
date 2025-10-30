import { test, expect } from '@playwright/test'; 
import { LoginPage } from '../src/pages/LoginPage';


test('login flow works on SauceDemo', async ({ page }) => {
  const login = new LoginPage(page);
  await page.goto('/');
  await expect(page).toHaveURL(/saucedemo/);
  await login.login(process.env.STANDARD_USER!, process.env.STANDARD_PASS!);
  await expect(page).toHaveURL(/inventory.html/);
});
