import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { USERNAME, PASSWORD } from '../playwright.config';

export class LoginPage extends BasePage {

  // ✅ All locators at top
  private usernameInput = 'input[name="authUser"]';
  private passwordInput = '#clearPass';
  private loginButton   = '#login-button';
  private mainMenu = '#mainMenu';

  constructor(page: Page) {
    super(page);  // passes page to BasePage
  }

  // Composed method — login in one step
  async login() {
    await this.navigate('https://demo.openemr.io/openemr/interface/login/login.php?site=default');
    await this.page.fill(this.usernameInput, USERNAME);
    await this.page.fill(this.passwordInput, PASSWORD);
    await this.page.click(this.loginButton);
    await this.waitForPageLoad();
  }

  // Check if main menu is visible after login
  async isMainMenuVisible(): Promise<boolean> {
    return await this.isVisible(this.mainMenu);
  }

  
 

}

/*
```

---

## What Every Line Does
```
import BasePage        → get common methods
import USERNAME        → from .env via config

private usernameInput  → locator stored at top
private passwordInput  → locator stored at top
private loginButton    → locator stored at top

constructor + super    → passes page to BasePage

enterUsername()        → types in username field
enterPassword()        → types in password field
clickLogin()           → clicks login button

login()                → does ALL steps in one call!
  navigate()           → from BasePage FREE!
  enterUsername()      → uses USERNAME from .env
  enterPassword()      → uses PASSWORD from .env
  clickLogin()         → clicks button
  waitForPageLoad()    → from BasePage FREE!

  */