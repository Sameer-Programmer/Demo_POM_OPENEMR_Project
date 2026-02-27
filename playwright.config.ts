import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Pick environment — default is qa
const ENV: string = process.env.ENV ?? 'qa';

// URLs
const URLS: Record<string, string> = {
  qa:  process.env.QA_URL  ?? '',
  uat: process.env.UAT_URL ?? '',
};

// Usernames
const USERS: Record<string, string> = {
  qa:  process.env.QA_USERNAME  ?? '',
  uat: process.env.UAT_USERNAME ?? '',
};

// Passwords
const PASSWORDS: Record<string, string> = {
  qa:  process.env.QA_PASSWORD  ?? '',
  uat: process.env.UAT_PASSWORD ?? '',
};

// Export for use in other files
export const BASE_URL: string = URLS[ENV];
export const USERNAME: string = USERS[ENV];
export const PASSWORD: string = PASSWORDS[ENV];

export default defineConfig({

  testDir: './tests',
  workers: 4,
  reporter: [['html'], ['list']],

  use: {
    baseURL: BASE_URL,
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 30000,
  },

  projects: [

    // STEP 1 — Runs FIRST always
    {
      name: 'setup',
      testMatch: '**/patient.setup.ts',
    },

    // ✅ Login — No dependencies, No storageState
    // Login does its OWN login!
    {
      name: 'login',
      testMatch: '**/login.spec.ts',
    },

    // STEP 2 — All PARALLEL after setup
    {
      name: 'ledger',
      testMatch: '**/ledger.spec.ts',
      dependencies: ['setup'],
      use: { storageState: 'test-data/session.json' },
    },

    {
      name: 'appointment',
      testMatch: '**/appointment.spec.ts',
      dependencies: ['setup'],
      use: { storageState: 'test-data/session.json' },
    },

    {
      name: 'encounter',
      testMatch: '**/encounter.spec.ts',
      dependencies: ['setup'],
      use: { storageState: 'test-data/session.json' },
    },

  ],

});
/*
```

---

## Why Login Has No Dependencies?
```
setup     → creates patient + saves session.json
login     → does its OWN login — no session needed!
ledger    → needs session.json from setup
appointment → needs session.json from setup
encounter → needs session.json from setup
*/