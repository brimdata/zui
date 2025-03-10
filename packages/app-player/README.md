# Zui Player

> End To End Testing Framework

The Zui end-to-end test suite uses [Playwright](https://playwright.dev/) as the test runner.

## Running Tests

When you are writing or debugging tests, you will usually be changing code in zui, then running the tests. To make this workflow streamlined, you will need to start the Zui dev renderer server and watch the main process code for changes.

You can do this with the command:

```
nx watch-code zui
```

In another terminal instance, you may run your tests like so:

```
nx test player
```

To run just one of the tests, specify the name of the file in the `tests` directory, e.g., The `-g` stands for 'grep' and can take a regex pattern argument.

```
nx test player -g pool-loads.spec.ts
```

## Running Tests in CI

When the tests run in CI, there will not be a dev server running, serving the HTML. Instead, the workflow will build the app and place static html files on the disk. Zui Player will then test against those files.

To simulate this locally, run the following commands:

```
nx build zui
NODE_ENV=production nx test player
```

## Artifacts

The [user data folder](https://zui.brimdata.io/docs/support/Filesystem-Paths#user-data) at the end of each test run can be found below the `run/playwright-itest` directory.

If you also want Playwright to record each test run, set the environment variable `VIDEO=true` and the videos can be found in the `run/videos` directory.

```
VIDEO=true NODE_ENV=production nx test player
```

## Writing a test

To write an e2e test, create a file called `[my-test].spec.ts` in the `tests` directory.

Import the `play` function from the "player" package.

Here's a template for getting started.

```ts
import { play } from 'app-player';
import { getPath } from '@brimdata/sample-data';

play('Preview & Load', (app, test) => {
  test('create new pool, change key, type <enter>', async () => {
    await app.dropFile(getPath('sample.zeektsv'));
    await app.click('button', 'Pool Settings');
    await app.fill('Pool Key', 'my_new_key');
    await app.press('Enter');

    await app.attached(/successfully finished loading/i);
  });
});
```

The app argument is a TestApp instance. Look at the TestApp class body for all the functions available. It wraps the playwright api.

## Selecting DOM Nodes

These are the four methods you need to know to get most work done.

```ts
await app.click();
await app.attached();
await app.detached();
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

https://playwright.dev/docs/api/class-page
