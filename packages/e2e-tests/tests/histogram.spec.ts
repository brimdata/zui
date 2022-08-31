import {test, expect} from "@playwright/test"
import TestApp from "../helpers/test-app"
import {getPath} from "zui-test-data"

test.describe("Ingest tests", () => {
  const app = new TestApp("Query tests")

  test.beforeAll(async () => {
    await app.init()
  })

  test.afterAll(async () => {
    await app.shutdown()
  })

  test("Histogram appears for zeek data", async () => {
    await app.createPool([getPath("small-zeek.zng")])
    await app.find(`role=button[name="Query Pool"]`).click()
    const results = app.find(`role=status[name="results"]`)

    await expect(results).toHaveText("Results: 31")

    const chart = app.find(`[aria-label="histogram"]`)
    await expect(chart).toBeVisible()
  })
})
