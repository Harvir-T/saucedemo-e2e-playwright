import { Page, expect } from '@playwright/test';
export class LoginPage {
  constructor(private page: Page) {}
  async goto() {
    await this.page.goto('/');
    await expect(this.page.getByRole('textbox', { name: 'Username' })).toBeVisible();
  }
  async login(username: string, password: string) {
    await this.page.getByRole('textbox', { name: 'Username' }).fill(username);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
}
