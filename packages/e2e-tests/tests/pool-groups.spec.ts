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

  test.beforeEach(async () => {
    await app.deleteAllPools()
    await app.find(':text("You have no pools yet")').waitFor()
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
    await app.zealot.createPool("/ starts with slash")
    await app.zealot.createPool("two /-/ slashes")
    const expected = ["", "starts with slash", "two", "-", "slashes"]

    for (let name of expected) {
      const item = app.find(`role=treeitem[name="${name}"]`)
      await expect(item).toBeVisible()
    }
  })

  test("rename group", async () => {
    await app.zealot.createPool("backups / today")
    await app.zealot.createPool("backups / yesterday")

    await app.find(`role=treeitem[name="backups"]`).click({button: "right"})
    await app.find(":text('Rename...')").click()

    await app.mainWin.keyboard.type("bkups")
    await app.mainWin.keyboard.press("Enter")

    await expect(app.find(":text('Renamed pools')")).toBeVisible()

    const pools = await app.zealot.getPools()
    expect(pools.map((p) => p.name).sort()).toEqual([
      "bkups / today",
      "bkups / yesterday",
    ])
  })

  test("delete group", async () => {
    await app.zealot.createPool("old / today")
    await app.zealot.createPool("old / yesterday")
    await app.zealot.createPool("new / tomorrow")

    const item = app.mainWin.getByRole("treeitem", {name: "old"})
    await item.click({button: "right"})
    await app.find(":text('Delete')").click()

    await expect(app.find(":text('Deleted 2 pools')")).toBeVisible()

    const pools = await app.zealot.getPools()
    expect(pools.map((p) => p.name).sort()).toEqual(["new / tomorrow"])
  })
})
