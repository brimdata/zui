# Zui Player

> End To End Testing Framework

The Zui end-to-end test suite uses [Playwright](https://playwright.dev/) as the test runner.

## Writing a test

To write an e2e test, create a file called `[my-test].spec.ts` in the `tests` directory.

Then create a describe block and initialize a new TestApp class within it. That class contains all the helper methods needed for quickly writing an end to end test.

Here's a template for getting started.

```ts
import { expect, test } from '@playwright/test';
import TestApp from '../helpers/test-app';

test.describe('Pool Groups', () => {
  const app = new TestApp('Pool Groups');

  test.beforeAll(async () => {
    await app.init();
  });

  test.afterAll(async () => {
    await app.shutdown();
  });

  test('cases', async () => {
    await app.query('1'); // and the like...
  });
});
```

## Running tests

To run all the e2e tests, at the top level of the Zui repo, execute:

```
yarn e2e
```

To run just one of the tests, specify the name of the file in the `tests` directory, e.g.,

```
nx test zui-player -g pool-loads.spec.ts
```

## Selecting DOM Nodes

These are the four methods you need to know to get most work done.

```ts
await app.click();
await app.attached();
await app.detacted();
await app.hidden();
await app.visible();
await app.locate();
```

They all have the same two signatures.

The first selects by aria role and aria name.

The second selects using regex for any text on the page.

```ts
await app.click(aria - role, aria - name);
// or
await app.click(regexp);
```

### Helpful Playwright Doc Links

https://playwright.dev/docs/api/class-locator

https://playwright.dev/docs/other-locators (formerly "Selectors")

https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques

https://playwright.dev/docs/api/class-pa
ge
