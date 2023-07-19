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
    expect(results).toEqual(["this", "1"])
    await app.mainWin.getByText("Load Successful").waitFor({state: "hidden"})
  })

  test("load more data into the pool", async () => {
    await app.mainWin.getByRole("treeitem", {name: "prs.json"}).click()
    await app.chooseFiles(
      app.mainWin.getByRole("button", {name: "Choose Files..."}),
      [getPath("prs.json")]
    )
    await app.mainWin.getByText("Load Successful").waitFor()
    await app.mainWin.getByRole("button", {name: "Query Pool"}).click()
    await app.query("count()")
    const results = await app.getViewerResults()
    expect(results).toEqual(["this", "2"])
    await app.mainWin.getByText("Load Successful").waitFor({state: "hidden"})
  })

  test("create with bad data deletes pool", async () => {
    await app.createPool([getPath("soccer-ball.png")], "Load error")
    await app.mainWin.getByText("Format detection error").waitFor()
    await app.mainWin
      .getByRole("treeitem", {name: "soccer-ball.png"})
      .waitFor({state: "hidden"})
    await app.mainWin.getByText("Load error").waitFor({state: "hidden"})
  })

  test("load data into pool does not delete pool", async () => {
    await app.mainWin.getByRole("treeitem", {name: "prs.json"}).click()
    await app.chooseFiles(
      app.mainWin.getByRole("button", {name: "Choose Files..."}),
      [getPath("soccer-ball.png")]
    )
    await app.find(":text('Load error')").isVisible()
    app.mainWin.getByRole("treeitem", {name: "prs.json"}).waitFor()
    await app.mainWin.getByText("Load error").waitFor({state: "hidden"})
  })
})
