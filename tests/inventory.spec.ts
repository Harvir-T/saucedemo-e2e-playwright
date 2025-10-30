import {test, expect} from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { inventory } from '../src/data/inventory';
import { InventoryPage } from '../src/pages/InventoryPage';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const login = new LoginPage(page);
    await login.goto();
    await login.login(process.env.STANDARD_USER!, process.env.STANDARD_PASS!);
    await expect(page).toHaveURL(/inventory\.html/);
});

test('inventory list renders expected items', async ({ page }) => {
    // verify there are 6 items in the inventory
    const inventoryItems = page.locator('.inventory_item');
    await expect(inventoryItems).toHaveCount(6);
    // verify each expected item is present and has correct price
    for (const item of inventory) {
        const itemLocator = page.locator(`.inventory_item:has-text("${item.name}")`);
        await expect(itemLocator).toBeVisible();
        const priceLocator = itemLocator.locator('.inventory_item_price');
        await expect(priceLocator).toHaveText(`$${item.price.toFixed(2)}`);
    }
});

test('each item shows name, description, price, and add to cart button', async ({ page }) => {
    // go through each inventory item 
    const inventoryItems = page.locator('.inventory_item');
    const count = await inventoryItems.count();
    for (let i = 0; i < count; i++) {
        // get each component within the item
        const item = inventoryItems.nth(i);
        const name = item.locator('.inventory_item_name');
        const description = item.locator('.inventory_item_desc');
        const price = item.locator('.inventory_item_price');
        const addToCartButton = item.locator('button:has-text("Add to cart")');
        // verify each component is visible
        await expect(name).toBeVisible();
        await expect(description).toBeVisible();
        await expect(price).toBeVisible();
        await expect(addToCartButton).toBeVisible();
    }
});

test('adding and removing items from cart updates button text and cart count', async ({ page }) => {
    // select the first inventory item
    const inventoryPage = new InventoryPage(page);
    const firstItem = inventoryPage.addFirstItemToCart();
    // verify button text changes to 'Remove'
    const removeButton = (await firstItem).getByRole('button', { name: 'Remove' });
    await expect(removeButton).toBeVisible();
    // verify cart icon shows 1 item
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');   
    //remove from cart
    await removeButton.click();
    //verify button text changes back to 'Add to cart'
    const addToCartButton = (await firstItem).getByRole('button', { name: 'Add to cart' });
    await expect(addToCartButton).toBeVisible();
    //verify cart icon badge is gone
    await expect(cartBadge).toBeHidden(); 
});

test('images load for all inventory items', async ({ page }) => {
    // go through each inventory item
    const inventoryItems = page.locator('.inventory_item');
    const count = await inventoryItems.count();
    for (let i = 0; i < count; i++) {
        const item = inventoryItems.nth(i);
        const image = item.locator('.inventory_item_img img');
        // verify image is visible
        await expect(image).toBeVisible();
        // verify image has loaded by checking naturalWidth
        const naturalWidth = await image.evaluate((img: HTMLImageElement) => img.naturalWidth);
        expect(naturalWidth).toBeGreaterThan(0);
    }
});





