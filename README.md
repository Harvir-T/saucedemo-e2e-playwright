# SauceDemo E2E with Playwright

I built this project to learn Playwright and TypeScript and to show my QA automation skills in a real-world web app (SauceDemo).
The goal was to design a clean, maintainable test suite that proves I can create automated UI tests from scratch using modern QA practices.

UI e2e tests for https://www.saucedemo.com using Playwright + TypeScript.

## What It Does

- Automates SauceDemo web flows: login, sorting, cart, checkout, menu, and route guards
- Uses a light Page Object Model for reusable steps
- Includes basic negative tests and a performance smoke check

## Tech Used 
Playwright · TypeScript · Node.js · Dotenv · GitHub Actions (for CI)

## Why This Project
I wanted hands-on experience with Playwright and to show:
- End-to-end UI automation setup
- Test design using TypeScript
- Environment handling and CI setup
- Clean test structure (not just quick scripts)

## Run Locally
```bash
npm i
npx playwright install
cp .env.example .env  # contains STANDARD_USER/ STANDARD_PASS
npm test
npm run report
