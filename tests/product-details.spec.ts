import {test, expect} from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { inventory } from '../src/data/inventory';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const login = new LoginPage(page);
    await login.login(process.env.STANDARD_USER!, process.env.STANDARD_PASS!);
    await expect(page).toHaveURL(/inventory\.html/);
});

test ('open each product from inventory page and verify details', async ({ page }) => {
    // get all product links
    const productLinks = page.locator('.inventory_item_name');
    const count = await productLinks.count();
    // iterate through each product link
    for (let i = 0; i < count; i++) {
        const link = productLinks.nth(i);
        const itemName = await link.textContent();
        // click the product link
        await link.click();
        // verify we're on the product details page
        await expect(page).toHaveURL(/inventory-item\.html/);
        // verify product name, description, price, and add to cart button
        const nameLocator = page.locator('.inventory_details_name');
        const descLocator = page.locator('.inventory_details_desc');
        const priceLocator = page.locator('.inventory_details_price');
        const addToCartButton = page.getByRole('button', { name: 'Add to cart' });
        await expect(nameLocator).toBeVisible();
        await expect(descLocator).toBeVisible();
        await expect(priceLocator).toBeVisible();
        await expect(addToCartButton).toBeVisible();
        // verify details match the inventory data
        const itemData = inventory.find(item => item.name === itemName);
        expect(itemData).toBeDefined();
        await expect(nameLocator).toHaveText(itemData!.name);
        await expect(priceLocator).toHaveText(`$${itemData!.price.toFixed(2)}`);
        // go back to inventory page
        await page.goBack();
        await expect(page).toHaveURL(/inventory\.html/);
    }
});

test('add to cart from product details page', async ({ page }) => {
    // select the first product
    const firstProductLink = page.locator('.inventory_item_name').first();
    const firstProductName = await firstProductLink.textContent();
    await firstProductLink.click();
    await expect(page).toHaveURL(/inventory-item\.html/);
    // click add to cart
    const addToCartButton = page.getByRole('button', { name: 'Add to cart' });
    await addToCartButton.click();
    // verify button text changes to 'Remove'
    const removeButton = page.getByRole('button', { name: 'Remove' });
    await expect(removeButton).toBeVisible();
    // verify cart icon shows 1 item
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');
    // go to cart page
    const cartLink = page.locator('.shopping_cart_link');
    await cartLink.click();
    await expect(page).toHaveURL(/cart\.html/);
    // verify the item is in the cart
    const cartItem = page.locator(`.cart_item:has-text("${firstProductName}")`);
    await expect(cartItem).toBeVisible();
});




