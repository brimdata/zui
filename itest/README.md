# Integration Tests

The purpose of the integration tests is to test Brim and ZQD
interactions. The test strategy is to focus on these interactions in the
tests and not exhaustively test the product this way. Note that some
tests are better suited as Brim unit tests or tests written in zq.git.

# Requirements

1. `npm install`
1. `npm run build`

# To Run

`npm run itest`

Parallelization is not supported, so `jest --runInBand` is forced in
`package.json`.

You can also run individual files like:

`npm run itest -- itest/tests/smoke.test.js`

See `npm run itest -- --help` for more, or see [Jest
docs](https://jestjs.io/docs/en/24.x/getting-started).

# Code Layout

* `itest/lib/app.js`: common tasks for performing actions in Brim
* `itest/lib/control.js`: control flow functions
* `itest/lib/jest.js`: Jest-specific adjustments to test behavior
* `itest/lob/log.js`: System-wide logging setup
* `itest/tests`: Tests, broken down by general feature/functionality
* `src/js/test/integration.js`: Single source of truth to define
  test and app interactions, like derivation of selectors.

# Code and Commit Style

Please use the same commit style as the rest of the code base. Code is
expected to pass lint/flow/format. There is a CI check for this.

# Adding a New Integration Test

1. If the integration test needs to interact with one or more elements,
   ensure they are defined
   1. At `src/js/test/integration.js`
   1. In their source. In most cases you can import and use the
      `reactElementProps()` function.
1. Add methods to `itest/lib/app.js` to interact with elements. For now
   I'm keeping these short. Recently I've begun to wrap them in
   `appStep()` for better debugging capabilties. The API to work with
   here is for [WebdriverIO v4](http://v4.webdriver.io/api.html).
   These tend to return promises, so write your methods accordingly.
1. Add tests in `itest/test`. Right now there's a lot of copying you
   must do. I haven't abstracted first-class test steps yet.
1. Run your tests locally via `npm run itest`.
1. Make sure your tests pass in CI. Pushing a branch will automatically
   trigger an execution of the integration tests.

# Updating Snapshots

You might need to update snapshots for one or more integration tests.
The mechanism to do this is:

`npm run itest -- -u [optional Jest test file listing]`.

Don't forget to `git add` any changes to snapshots. You must add
mikesbrown as a reviewer when changing snapshots. [Jest
docs](https://jestjs.io/docs/en/24.x/snapshot-testing#1-treat-snapshots-as-code)
even say to review these as carefully as code.

If you want to patch JSON by hand, you're on your own to make Jest
happy, but you should still include mikesbrown as a reviewer.
