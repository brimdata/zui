import {test, expect} from "@playwright/test"
import TestApp from "../helpers/test-app"
import {getPath} from "zui-test-data"

test.describe("Histogram Spec", () => {
  const app = new TestApp("Histogram Spec")

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
    await expect(results).toHaveText(/Results:/)

    const chart = app.find(`[aria-label="histogram"]`)
    await expect(chart).toBeVisible()
  })

  test("Histogram does not appears for non-zeek data", async () => {
    await app.createPool([getPath("prs.json")])
    await app.find(`role=button[name="Query Pool"]`).click()

    const results = app.find(`role=status[name="results"]`)
    await expect(results).toHaveText(/Results:/)

    const chart = app.find(`[aria-label="histogram"]`)
    await expect(chart).toBeHidden()
  })
})
