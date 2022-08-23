import {test, expect} from "@playwright/test"
import path from "path"
import {testDataDir} from "../helpers/env"
import TestApp from "../helpers/test-app"

test.describe("Query tests", () => {
  const app = new TestApp("Query tests")

  test.beforeAll(async () => {
    await app.init()
    await app.createPool([
      path.normalize(path.join(testDataDir(), "sample.tsv")),
    ])
    await app.mainWin
      .locator('#app-root button:above(:text("Query Pool"))')
      .first()
      .click()
  })

  test.afterAll(async () => {
    await app.shutdown()
  })

  test("session queries are the default and ordered properly in history", async () => {
    await app.query("1")
    await app.query("2")
    await app.query("3")
    const history = await app.mainWin.locator(
      'div[aria-label="history-pane"] > div > div > p'
    )
    const entries = await history.evaluateAll<string[], HTMLElement>((nodes) =>
      nodes.map((n) => n.innerText.trim())
    )
    expect(entries).toEqual(["3", "now", "2", "now", "1", "now"])

    await expect(await app.mainWin.locator("_react=HeadingSaved")).toBeHidden()
  })

  test("named queries' creation, modification, update/save, proper outdated status display", async () => {
    // creation
    await app.mainWin.locator('button :text-is("Save")').click()
    await app.mainWin
      .locator('[placeholder="Query name\\.\\.\\."]')
      .fill("Test Query Name")
    await app.mainWin.locator('button :text-is("Create")').click()
    await expect(await app.mainWin.locator("_react=HeadingSaved")).toBeVisible()
    await expect(
      await app.mainWin.locator('button :text-is("Test Query Name")')
    ).toBeVisible()

    // modification
    await app.query("4")
    await expect(
      await app.mainWin.locator('button :text-is("Test Query Name *")')
    ).toBeVisible()

    // update
    await app.mainWin.locator('button :text-is("Save")').click()
    await expect(
      await app.mainWin.locator('button :text-is("Test Query Name")')
    ).toBeVisible()

    // outdated display
    await app.mainWin
      .locator('div[aria-label="history-pane"] p >> nth=2')
      .click()
    await expect(
      await app.mainWin.locator("text=Test Query Name Outdated")
    ).toBeVisible()
  })

  test("named query, save as => new named query", async () => {
    await app.mainWin.locator('button :text-is("Save As")').click()
    await app.mainWin
      .locator('[placeholder="Query name\\.\\.\\."]')
      .fill("Another Test Query")
    await app.mainWin
      .locator('div[role="textbox"]')
      .fill("another test query zed value")
    await app.mainWin.locator('button :text-is("Create")').click()
    await expect(
      await app.mainWin.locator('button :text-is("Another Test Query")')
    ).toBeVisible()
    await expect(
      await app.mainWin.locator(
        'div[role="textbox"]:has-text("another test query zed value")'
      )
    ).toBeVisible()
  })
})
