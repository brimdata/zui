import {expect, test} from "@playwright/test"
import TestApp from "../helpers/test-app"
import {getPath} from "zui-test-data"

test.describe("Pool Loads", () => {
  const app = new TestApp("Pool Loads")

  test.beforeAll(async () => {
    await app.init()
  })

  test.afterAll(async () => {
    await app.shutdown()
  })

  // These depend on the order in which they run. They must all be run together.
  test("load data into a pool", async () => {
    await app.createPool([getPath("prs.json")])
    await app.mainWin.getByRole("button", {name: "Query Pool"}).click()
    await app.query("count()")
    const results = await app.getViewerResults()
    expect(results).toEqual(["count", "1"])
  })

  test("load more data into the pool", async () => {
    await app.mainWin.getByRole("treeitem", {name: "prs.json"}).click()
    await app.chooseFiles(
      app.mainWin.getByRole("button", {name: "Load Data"}),
      [getPath("prs.json")]
    )
    await app.find(":text('Load successful')").isVisible()
    await app.mainWin.getByRole("button", {name: "Query Pool"}).click()
    await app.query("count()")
    const results = await app.getViewerResults()
    expect(results).toEqual(["count", "2"])
  })

  test("create with bad data deletes pool", async () => {
    await app.createPool([getPath("soccer-ball.png")])
    await expect(app.find(":text('Format detection error')")).toBeVisible()
    await expect(
      app.mainWin.getByRole("treeitem", {name: "soccer-ball.png"})
    ).toBeHidden()
  })

  test("load data into pool does not delete pool", async () => {
    await app.mainWin.getByRole("treeitem", {name: "prs.json"}).click()
    await app.chooseFiles(
      app.mainWin.getByRole("button", {name: "Load Data"}),
      [getPath("soccer-ball.png")]
    )
    await app.find(":text('Load error')").isVisible()
    await expect(
      app.mainWin.getByRole("treeitem", {name: "prs.json"})
    ).toBeVisible()
  })
})
