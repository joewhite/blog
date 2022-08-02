import {test, expect} from '@playwright/test';

test('root page loads', async ({page}) => {
  await page.goto('/');
  // TODO: Get some better content, write a better assertion
  await expect(page.locator('text=Joe White\'s Blog')).toBeVisible();
});
test('year page loads', async ({page}) => {
  await page.goto('/2004');
  // TODO: Get some better content, write a better assertion
  await expect(page.locator('article')).toContainText('Slug = ["2004"]');
});
test('post loads', async ({page}) => {
  await page.goto('/2004/05/15/systemcomponentmodel');
  await expect(page.locator('article').first()).toContainText('System.ComponentModel');
  await expect(page.locator('article').first()).toContainText('So I\'m finally entering the blogging arena.');
});
test('404', async ({page}) => {
  await page.goto('/2004/05/15/invalid-slug');
  await expect(page.locator('h1')).toHaveText('404');
});
