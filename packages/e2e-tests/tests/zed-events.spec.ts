import TestApp from "../helpers/test-app"
import {test, expect} from "@playwright/test"

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
      pool: {id},
    } = await app.zealot.createPool("test-pool-new")
    await expect(app.mainWin.locator("text=test-pool-new")).toBeVisible()
    await app.zealot.updatePool(id, {name: "test-pool-update"})
    await expect(app.mainWin.locator("text=test-pool-update")).toBeVisible()
    await app.zealot.deletePool(id)
    await app.mainWin.waitForSelector("text=test-pool-update", {
      state: "detached",
    })
  })
})
