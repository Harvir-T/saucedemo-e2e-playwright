import { Page, expect } from '@playwright/test';

export class InventoryPage {
  constructor(private page: Page) {}

  // add the very first item in the inventory to the cart
  async addFirstItemToCart() {
     // select the first inventory item
    const firstItem = this.page.locator('.inventory_item').first();
    const addToCartButton = firstItem.getByRole('button', { name: 'Add to cart' });
    await expect(addToCartButton).toBeVisible();
    // add to cart
    await addToCartButton.click();
    return firstItem;
  }

  // open the left-side burger menu
  async openMenu() {
    // open the menu
  const menuButton = this.page.getByRole('button', { name: 'Open Menu' });
  await expect(menuButton).toBeVisible();
  await menuButton.click();
  }
}
