import { test, expect } from '../fixtures/ehrFixtures';

test.describe('Login Module', () => {
  test('should login successfully', async ({ loginPage, page }) => {
    // Action from LoginPage
    await loginPage.login();

    

    // Assertion: verify main menu is visible
    const isMainMenuVisible = await loginPage.isMainMenuVisible();
    await expect(isMainMenuVisible).toBe(true);
  });
});
