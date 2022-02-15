import {selectorWithText} from "../helpers/helpers"
import {poolItem} from "../helpers/locators"
import TestApp from "../helpers/test-app"

import {test} from "@playwright/test"

test.describe("Handle Zed server events", () => {
  const app = new TestApp("Zed Events")

  test.beforeAll(async () => {
    await app.init()
  })
  test.afterAll(async () => {
    await app.shutdown()
  })

  test("pool-new/update/delete/commit", async () => {
    const {
      pool: {id}
    } = await app.zealot.createPool("test-pool-new")
    await app.mainWin.waitForSelector(
      selectorWithText(poolItem.css, "test-pool-new")
    )
    await app.zealot.updatePool(id, {name: "test-pool-update"})
    await app.mainWin.waitForSelector(
      selectorWithText(poolItem.css, "test-pool-update")
    )
    await app.zealot.deletePool(id)
    await app.mainWin.waitForSelector(poolItem.css, {state: "detached"})
  })
})
