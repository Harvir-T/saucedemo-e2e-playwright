# SauceDemo E2E with Playwright

UI e2e tests for https://www.saucedemo.com using Playwright + TypeScript.
Covers: login (success/negative), inventory sorting, product details, cart/checkout, menu links, security tests (route guards) and a small performance test.

## Run locally
```bash
npm i
npx playwright install
cp .env.example .env  # contains STANDARD_USER/ STANDARD_PASS
npm test
npm run report
