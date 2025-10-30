import {test, expect} from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';

const x = 5, firstName='John', lastName='Doe', postalCode='12345';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const login = new LoginPage(page);
    await login.goto();
    await login.login(process.env.STANDARD_USER!, process.env.STANDARD_PASS!);
    await expect(page).toHaveURL(/inventory.html/);
});

test('add item to cart from inventory page', async ({ page }) => {
    // ensure we're on the inventory page
    await expect(page).toHaveURL(/inventory\.html/);
    // add first item to cart 
    const firstItem=page.locator('.inventory_item').first();
    const firstItemName=await firstItem.locator('.inventory_item_name').innerText();
    console.log('Adding to cart item:', firstItemName);
    const addToCartButton=firstItem.locator('button').filter({ hasText: 'Add to cart' });
    await addToCartButton.click();
    // verify remove button is now visible
    const removeButton = page.getByRole('button', { name: 'Remove' });
    await expect(removeButton).toBeVisible();
    //verify cart badge shows 1 item
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');
    //verify item is added to cart page
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.locator('.cart_item').first().locator('.inventory_item_name')).toHaveText(firstItemName);
});

test('remove item from cart from inventory page', async ({ page }) => {
    // ensure we're on the inventory page
    await expect(page).toHaveURL(/inventory\.html/);
    // add first item to cart
    const firstItem=page.locator('.inventory_item').first();
    const addToCartButton=firstItem.locator('button').filter({ hasText: 'Add to cart' });
    await addToCartButton.click();
    // ensure the remove button is visible
    const removeButton = page.getByRole('button', { name: 'Remove' });
    await expect(removeButton).toBeVisible();
    // click remove button
    await removeButton.click();
    // verify add to cart button is now visible
    await expect(addToCartButton).toBeVisible();
    // verify cart badge is gone
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveCount(0);
    // verify cart is empty
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/cart\.html/);
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(0);
});

test('add multiple items to cart and remove one', async ({ page }) => {
    // ensure we're on the inventory page
    await expect(page).toHaveURL(/inventory\.html/);
    // add x amount of items to cart
    for (let i=0; i<x; i++) {
        await page.locator('.inventory_item').nth(i).locator('button').filter({ hasText: 'Add to cart' }).click();
    }
    // verify cart badge shows x items
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText(x.toString());
    // remove one item from cart
    const itemToRemove = page.locator('.inventory_item').nth(0);
    await itemToRemove.locator('button').filter({ hasText: 'Remove' }).click();
    // verify cart badge shows x-1 items
    await expect(cartBadge).toHaveText((x-1).toString());
});

test('Checkout process works', async ({ page }) => {
    // ensure we're on the inventory page
    await expect(page).toHaveURL(/inventory\.html/);
    // add first item to cart
    const firstItem=page.locator('.inventory_item').first();
    const firstItemName=await firstItem.locator('.inventory_item_name').innerText();
    const addToCartButton=firstItem.locator('button').filter({ hasText: 'Add to cart' });
    await addToCartButton.click();
    // go to cart page
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/cart\.html/);
    // click checkout
    const checkoutButton = page.getByRole('button', {name: 'Checkout'});
    await checkoutButton.click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    // fill in checkout info
    await page.getByPlaceholder('First Name').fill(firstName);
    await page.getByPlaceholder('Last Name').fill(lastName);
    await page.getByPlaceholder('Postal Code').fill(postalCode);
    // continue to next step
    const continueButton = page.getByRole('button', {name: 'Continue'});
    await continueButton.click();
    //ensure we're on checkout step two page
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    //verify item is present
    await expect(page.locator('.cart_item').first().locator('.inventory_item_name')).toHaveText(firstItemName);
    //finish checkout
    const finishButton = page.getByRole('button', {name: 'Finish'});
    await finishButton.click();
    //verify we're on checkout complete page
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(page.getByText('THANK YOU FOR YOUR ORDER')).toBeVisible();
});

test('Checkout cancel works', async ({ page }) => {
    // ensure we're on the inventory page
    await expect(page).toHaveURL(/inventory\.html/);
    // add first item to cart
    const firstItem=page.locator('.inventory_item').first();
    const addToCartButton=firstItem.locator('button').filter({ hasText: 'Add to cart' });
    await addToCartButton.click();
    // go to cart page
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/cart\.html/);
    // click checkout
    const checkoutButton = page.getByRole('button', {name: 'Checkout'});
    await checkoutButton.click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    // fill in checkout info
    await page.getByPlaceholder('First Name').fill(firstName);
    await page.getByPlaceholder('Last Name').fill(lastName);
    await page.getByPlaceholder('Postal Code').fill(postalCode);
    // continue to next step
    const continueButton = page.getByRole('button', {name: 'Continue'});
    await continueButton.click();
    //ensure we're on checkout step two page
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    //click cancel
    const cancelButton = page.getByRole('button', {name: 'Cancel'});
    await cancelButton.click();
    //verify we're on inventory page
    await expect(page).toHaveURL(/inventory\.html/);
    //go back to cart page
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/cart\.html/);
    //select checkout again
    await checkoutButton.click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    //click cancel
    await cancelButton.click();
    //verify we're back on cart page
    await expect(page).toHaveURL(/cart\.html/);
});

test('Overview total is correct', async ({ page }) => {
    // ensure we're on the inventory page
    await expect(page).toHaveURL(/inventory\.html/);
    // add x amount of items to cart
    let expectedTotal = 0;
    for (let i=0; i<x; i++) {
        const item = page.locator('.inventory_item').nth(i);
        const priceText = await item.locator('.inventory_item_price').innerText();
        const price = parseFloat(priceText.replace('$',''));
        expectedTotal += price;
        await item.locator('button').filter({ hasText: 'Add to cart' }).click();
    }
    // go to cart page
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/cart\.html/);
    // click checkout
    const checkoutButton = page.getByRole('button', {name: 'Checkout'});
    await checkoutButton.click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    // fill in checkout info
    await page.getByPlaceholder('First Name').fill(firstName);
    await page.getByPlaceholder('Last Name').fill(lastName);
    await page.getByPlaceholder('Postal Code').fill(postalCode);
    // continue to next step
    const continueButton = page.getByRole('button', {name: 'Continue'});
    await continueButton.click();
    //ensure we're on checkout step two page
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    //add tax to expected total
    const taxRate = 0.08; //8% tax
    expectedTotal = parseFloat((expectedTotal * (1 + taxRate)).toFixed(2));
    //verify total amount
    const totalText = await page.locator('.summary_total_label').innerText();
    const totalMatch = totalText.match(/Total: \$([0-9]+\.[0-9]{2})/);
    expect(totalMatch).not.toBeNull();
    const actualTotal = parseFloat(totalMatch![1]);
    expect(actualTotal).toBeCloseTo(expectedTotal, 2);
    console.log('Expected total:', expectedTotal, 'Actual total:', actualTotal);
});

test('required fields validation on checkout info page', async ({ page }) => {
    // ensure we're on the inventory page
    await expect(page).toHaveURL(/inventory\.html/);
    // add first item to cart
    const firstItem = page.locator('.inventory_item').first();
    const addToCartButton = firstItem.locator('button').filter({ hasText: 'Add to cart' });
    await addToCartButton.click();
    // go to cart page
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/cart\.html/);
    // click checkout
    const checkoutButton = page.getByRole('button', { name: 'Checkout' });
    await checkoutButton.click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    // try to continue without filling in any info
    const continueButton = page.getByRole('button', { name: 'Continue' });
    await continueButton.click();
    // verify error message is shown 
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Error: First Name is required');
    // fill in first name only
    await page.getByPlaceholder('First Name').fill(firstName);
    await continueButton.click();
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Error: Last Name is required');
    // fill in last name only 
    await page.getByPlaceholder('Last Name').fill(lastName);
    await continueButton.click();
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Error: Postal Code is required');
    // fill postal code 
    await page.getByPlaceholder('Postal Code').fill(postalCode);
    await continueButton.click();
    // verify we're on checkout step two page
    await expect(page).toHaveURL(/checkout-step-two\.html/);
});



