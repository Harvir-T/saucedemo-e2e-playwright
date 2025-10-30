import {test, expect} from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const login = new LoginPage(page);
    await login.login(process.env.STANDARD_USER!, process.env.STANDARD_PASS!);
    await expect(page).toHaveURL(/inventory\.html/);
});

test ('Logout works from inventory page', async ({ page }) => {
    // ensure we're on the inventory page
    await expect(page).toHaveURL(/inventory\.html/);    
    // open the menu
    await page.getByRole('button', { name: 'Open Menu' }).click();
    // click logout
    const logout = page.locator('[data-test="logout-sidebar-link"]');
    await logout.click();
    // verify we're back on the login page
    await expect(page).toHaveTitle('Swag Labs');
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});
   

