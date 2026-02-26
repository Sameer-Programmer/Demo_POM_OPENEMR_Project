# 🏥 Demo POM OpenEMR Project

> A production-grade Playwright automation framework built with **Pure Page Object Model**, **Custom Fixtures**, **Parallel Execution**, and **Multi-Environment Support** — targeting the OpenEMR Healthcare Application.

---

## 📌 Table of Contents

- [About This Project](#about-this-project)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [POM Concepts](#pom-concepts)
- [Environment Setup](#environment-setup)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Parallel Execution Flow](#parallel-execution-flow)
- [Key Design Decisions](#key-design-decisions)
- [What This Project Demonstrates](#what-this-project-demonstrates)

---

## 🎯 About This Project

This project automates the **OpenEMR Healthcare Portal** using Playwright with TypeScript.

The framework is built from scratch following industry best practices:

- **Pure POM** — Page Objects contain only locators and actions. Never assertions.
- **Custom Fixtures** — Auto setup before every test. No repeated code.
- **Parallel Execution** — Multiple modules run simultaneously after patient setup.
- **Multi-Environment** — Switch between QA and UAT with one variable change.
- **Secure Credentials** — All credentials stored in `.env` — never pushed to GitHub.

**Application Under Test:** https://demo.openemr.io/openemr

---

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| Playwright | Browser automation framework |
| TypeScript | Strongly typed JavaScript |
| Node.js | Runtime environment |
| dotenv | Secure credential management |
| GitHub Actions | CI/CD pipeline |

---

## 🏗 Architecture

The framework follows a strict 3-layer POM architecture:

```
┌─────────────────────────────────┐
│         TEST FILES              │  ← Assertions only
│      (*.spec.ts)                │
└────────────┬────────────────────┘
             │ uses
┌────────────▼────────────────────┐
│          FIXTURES               │  ← Auto setup + Page objects
│      (ehrFixtures.ts)           │
└────────────┬────────────────────┘
             │ provides
┌────────────▼────────────────────┐
│        PAGE OBJECTS             │  ← Locators + Actions only
│  (LoginPage, PatientPage...)    │
└────────────┬────────────────────┘
             │ extends
┌────────────▼────────────────────┐
│          BASE PAGE              │  ← Common methods
│        (BasePage.ts)            │
└─────────────────────────────────┘
```

### Layer Responsibilities

| Layer | File | Contains | Never Contains |
|-------|------|----------|----------------|
| Base | BasePage.ts | Common methods | Assertions |
| Pages | LoginPage.ts etc. | Locators + Actions | Assertions |
| Fixtures | ehrFixtures.ts | Page instances + data | Business logic |
| Setup | patient.setup.ts | One time patient creation | Assertions |
| Tests | *.spec.ts | Assertions only | Locators |

---

## 📁 Folder Structure

```
Demo_POM_OPENEMR_Project/
│
├── .github/
│   └── workflows/
│       └── playwright.yml        # CI/CD pipeline
│
├── fixtures/
│   └── ehrFixtures.ts            # Connects pages to tests
│
├── pages/
│   ├── BasePage.ts               # Foundation — all pages extend this
│   ├── LoginPage.ts              # Login page locators + actions
│   ├── PatientPage.ts            # Patient creation locators + actions
│   ├── LedgerPage.ts             # Ledger module locators + actions
│   ├── AppointmentPage.ts        # Appointment module locators + actions
│   └── EncounterPage.ts          # Encounter module locators + actions
│
├── tests/
│   ├── setup/
│   │   └── patient.setup.ts      # Runs ONCE — creates patient + saves session
│   ├── ledger.spec.ts            # Ledger test assertions
│   ├── appointment.spec.ts       # Appointment test assertions
│   └── encounter.spec.ts         # Encounter test assertions
│
├── test-data/                    # Auto generated at runtime — gitignored
│   ├── patientData.json          # Stores patient ID
│   └── session.json              # Stores login session
│
├── .env                          # Credentials — NEVER pushed to GitHub
├── .env.example                  # Template for credentials
├── .gitignore                    # Excludes .env + test-data + node_modules
├── playwright.config.ts          # Parallel execution + environment config
├── package.json                  # Project dependencies
└── README.md                     # You are here!
```

---

## 💡 POM Concepts

### What is POM?

Page Object Model separates **how to interact** with a page from **what to verify**.

```
Page Object  →  HOW to interact with page
Test File    →  WHAT to verify and assert
```

### Pure POM Rules

| ✅ DO THIS | ❌ NEVER DO THIS |
|-----------|----------------|
| Define locators at TOP of page class | Write locators inside methods |
| Only UI actions in page objects | Write assertions in page objects |
| Assertions only in spec files | Mix test logic with page logic |
| Extend BasePage for all pages | Duplicate common methods |
| One class per page | Mix multiple pages in one file |
| Pass data as parameters | Hardcode test data in page objects |

### What is a Fixture?

Fixtures auto-prepare everything a test needs before it runs.

```typescript
// Without fixtures — repeated in every test ❌
test('ledger', async ({ page }) => {
  const login = new LoginPage(page)
  await login.login('admin', 'pass')
  const ledger = new LedgerPage(page)
  const patientId = readFile()
  // actual test...
})

// With fixtures — clean and automatic ✅
test('ledger', async ({ ledgerPage, patientId }) => {
  // ledgerPage and patientId are ready automatically!
})
```

---

## ⚙️ Environment Setup

### Step 1 — Clone the Repository

```bash
git clone https://github.com/yourusername/Demo_POM_OPENEMR_Project.git
cd Demo_POM_OPENEMR_Project
```

### Step 2 — Install Dependencies

```bash
npm install
```

### Step 3 — Install Playwright Browsers

```bash
npx playwright install
```

### Step 4 — Setup Credentials

Copy `.env.example` and rename to `.env`:

```bash
cp .env.example .env
```

Fill in your credentials inside `.env`:

```
# Active Environment
ENV=qa

# QA Environment
QA_URL=https://demo.openemr.io/openemr
QA_USERNAME=admin
QA_PASSWORD=pass

# UAT Environment
UAT_URL=https://demo.openemr.io/openemr
UAT_USERNAME=admin
UAT_PASSWORD=pass
```

---

## ▶️ Running Tests

### Run All Tests (Default QA)

```bash
npx playwright test
```

### Run with UI Mode (Recommended for Learning)

```bash
npx playwright test --ui
```

### Run Specific Module

```bash
npx playwright test ledger
npx playwright test appointment
npx playwright test encounter
```

### Run on Different Environment

```bash
# QA (default)
npx playwright test

# UAT — Windows PowerShell
$env:ENV="uat" ; npx playwright test

# UAT — Mac/Linux
ENV=uat npx playwright test
```

### View HTML Report

```bash
npx playwright show-report
```

---

## ⚡ Parallel Execution Flow

```
npx playwright test
        │
        ▼
┌───────────────────────┐
│  patient.setup.ts     │  ← Runs FIRST — creates patient
│  Login + Create       │
│  Save patientId  ─────┼──► test-data/patientData.json
│  Save session    ─────┼──► test-data/session.json
└──────────┬────────────┘
           │ setup complete
           ▼
┌──────────────────────────────────────────┐
│           PARALLEL WORKERS               │
│                                          │
│  ledger.spec      → Worker 1 🟢         │
│  appointment.spec → Worker 2 🟢         │
│  encounter.spec   → Worker 3 🟢         │
│                                          │
│  Each worker:                            │
│  ├── Own independent browser             │
│  ├── Loads session.json (already login)  │
│  └── Reads same patientId               │
└──────────────────────────────────────────┘
           │
           ▼
    📊 HTML Report
```

### Why Workers are Independent

| Question | Answer |
|----------|--------|
| Can Worker 1 affect Worker 2? | No — completely independent |
| Do they share the browser? | No — each has own browser |
| Do they share patient ID? | Yes — read only from file |
| If Worker 1 fails, does Worker 2 stop? | No — runs independently |

---

## 🔑 Key Design Decisions

### 1. storageState — No Re-Login

```
Without storageState:           With storageState:
Each worker logs in again ❌    Login once in setup ✅
Slow execution ❌               Fast execution ✅
Risk of login failures ❌       Stable tests ✅
```

### 2. .env for Credentials

```
Without .env:                   With .env:
Hardcoded in code ❌            Stored safely ✅
Pushed to GitHub ❌             Never pushed ✅
Hard to change ❌               Change one line ✅
```

### 3. Multi-Environment Support

```
ENV=qa   → runs all tests on QA environment
ENV=uat  → runs all tests on UAT environment

Same code — just one variable change!
```

### 4. Patient Created Once

```
Without setup:                  With setup:
Each test creates patient ❌    Patient created once ✅
Slow and wasteful ❌            Fast and efficient ✅
Different patient IDs ❌        Same patient for all ✅
```

---

## 🎯 What This Project Demonstrates

This framework showcases the following skills:

```
✅ Pure Page Object Model (POM)
✅ Custom Fixtures
✅ Parallel Test Execution
✅ Setup Dependencies (runs FIRST)
✅ storageState — Session Management
✅ Multi-Environment Support (QA / UAT)
✅ Secure Credential Management (.env)
✅ TypeScript with Playwright
✅ CI/CD with GitHub Actions
✅ Professional Project Structure
✅ EHR Domain Knowledge
```

---

## 📝 Notes

- Demo app resets every day at **8AM UTC** — all data is wiped
- `test-data/` folder is auto generated at runtime — never commit it
- Always run `npm install` after cloning
- Use `--ui` mode while learning — it shows browser step by step

---

*Built with ❤️ for learning and portfolio purposes*
