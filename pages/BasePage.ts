import { Page } from '@playwright/test';

export class BasePage {

    protected page: Page;  // belongs to all object 

    constructor(page: Page) {
        this.page = page;
    }

    // Go to any URL
  async navigate(url: string) {
    await this.page.goto(url);
  }

  // Wait for page to fully load
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  // Get text from any element
  async getText(locator: string): Promise<string> {
    return (await this.page.locator(locator).textContent()) ?? '';
  }

  // Check if element is visible on page
  async isVisible(locator: string): Promise<boolean> {
    return await this.page.locator(locator).isVisible();
  }

  // Wait for element to appear
  async waitForElement(locator: string) {
    await this.page.locator(locator).waitFor();
  }

}
/*

---

## Simple Summary
```
BasePage = 5 common things
│
├── constructor     → setup
├── navigate        → go to page
├── waitForPageLoad → wait to load
├── getText         → read text
└── isVisible       → check element
*/