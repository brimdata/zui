import {expect, test} from "@playwright/test"
import TestApp from "../helpers/test-app"

test.describe("Pool Groups", () => {
  const app = new TestApp("Pool Groups")

  test.beforeAll(async () => {
    await app.init()
    const pools = await app.find("role=button[name='Pools']")
    await pools.click()
  })

  test.afterAll(async () => {
    await app.shutdown()
  })

  test("groups pools by slash", async () => {
    await app.zealot.createPool("backups / today")
    await app.zealot.createPool("backups / yesterday")
    const expected = ["backups", "today", "yesterday"]

    for (let name of expected) {
      const item = app.find(`role=treeitem[name="${name}"]`)
      await expect(item).toBeVisible()
    }
  })

  test("edge cases", async () => {
    await app.deleteAllPools()

    await app.zealot.createPool("/ starts with slash")
    await app.zealot.createPool("two /-/ slashes")
    const expected = ["", "starts with slash", "two", "-", "slashes"]

    for (let name of expected) {
      const item = app.find(`role=treeitem[name="${name}"]`)
      await expect(item).toBeVisible()
    }
  })
})
