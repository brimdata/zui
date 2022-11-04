# e2e-tests

> End To End Testing Framework

The zui end-to-end test suite use playwright as the test runner.

To write an e2e test, create a file called `[my-test].spec.ts` in the `tests` directory.

Then create a describe block and initialize a new TestApp class within it. That class contain all the helper methods needed for quickly writing an end to end test.

Here's a template for getting started.

```ts
test.describe("Pool Groups", () => {
  const app = new TestApp("Pool Groups")

  test.beforeAll(async () => {
    await app.init()
  })

  test.afterAll(async () => {
    await app.shutdown()
  })

  test("cases", async () => {
    await app.query("1") // and the like...
  })
})
```

## Selecting DOM Nodes

These are common ways to select nodes.

```ts
await app.find("role=button[name=create]").click()
await app.find(':text("New Query Session")').click()
```
