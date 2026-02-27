import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// Define fixture types
type EhrFixtures = {
  loginPage: LoginPage;
};

// Extend base test with our fixtures
export const test = base.extend<EhrFixtures>({

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

});

export { expect };
//fixtures\ehrFixtures.ts