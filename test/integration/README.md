# Integration Tests

The purpose of the integration tests is to test Brim and ZQD
interactions. The test strategy is to focus on these interactions in the
tests and not exhaustively test the product this way. Note that some
tests are better suited as Brim unit tests or tests in the Zed repository.

The tests use Jest and Spectron.

- https://jestjs.io
- https://www.electronjs.org/spectron
- https://github.com/electron-userland/spectron

## Requirements

1. `npm install`
1. `npm run build`

## To Run

`npm run itest`

Parallelization is not supported, so `jest --runInBand` is forced in
`package.json`.

You can also run individual files like:

`npm run itest -- itest/tests/smoke.test.ts`

See `npm run itest -- --help` for more, or see [Jest
docs](https://jestjs.io/docs/getting-started).

## Code Layout

- `itest/lib/`:  test support code
- `itest/tests/`: the test cases
- `itest/testdata/`: sample logs and pcaps to ingest

## Adding a New Integration Test

Writing an integration test usually involves performing an action in the UI, 
finding an element in the DOM, and asserting it contains the expected value.

For example:

```js
import itest from "../lib/itest"

describe("ingest and check viewer count", () => {
   const [brim, $] = itest("ingest-viewer-count")

   beforeAll(() => brim.ingest("sample.tsv"))
   
   test("row count", () => {
      const rows = brim.findAll($.viewerRows)
      expect(rows.length).toBe(30)
   })
})
```

The helper function `itest()` must be called within a describe block. It takes a string
name argument that is used for the log file of this test run. It returns an instance of
 `BrimDriver` (`brim`) and `BrimSelectors` (`$`).

You can think of these classes like this:

1. **BrimDriver**: Performs actions (click, input, ingest...)
2. **BrimSelectors**: Creates string selectors for known elements (viewer headers, detail pane...)

## Element Locators

When you need to find a known element, tag it in the code with a locator. A locator provides
a maintainable way to keep track of which elements are needed for integration tests.

```js
type Locator = {
   css: string // a css selector
   xpath: string // an xpath selector
   props: {data-test-locator: string} // props to pass to the react component
}
```

First create one in `src/js/test/locators.ts`.

```js
// The argument will be the value of the data attribute.
export const detailPane = createLocator("detail-pane")
```

Add it to your component.

```js
import {detailPane} from "../test/locators"

<DetailPane {...detailPane.props}>
```

Add it to the Brim Selectors class.

```js
class BrimSelectors {
   detailPane = detailPane.css
}
```

Now you can find the detail pane in the test cases.

```js
   const [brim, $] = itest()

   test("find the detail pane", () => {
      brim.find($.detailPane)
   })
```

> Selectors in the BrimSelectors class don't need to be locator instances,
but having a locator will signal to developers that an integration test needs that
component.
## Updating Snapshots

You might need to update snapshots for one or more integration tests.
The mechanism to do this is:

`npm run itest -- -u [optional Jest test file listing]`.

Don't forget to `git add` any changes to snapshots. You must add
mikesbrown as a reviewer when changing snapshots. [Jest
docs](https://jestjs.io/docs/snapshot-testing#1-treat-snapshots-as-code)
even say to review these as carefully as code.

If you want to patch JSON by hand, you're on your own to make Jest
happy, but you should still include mikesbrown as a reviewer.
