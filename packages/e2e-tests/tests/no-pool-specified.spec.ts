import {expect, test} from "@playwright/test"
import TestApp from "../helpers/test-app"
import {getPath} from "zui-test-data"

test.describe("No Pool Specified State", () => {
  const app = new TestApp("No Pool Specified")

  test.beforeAll(async () => {
    await app.init()
  })

  test.afterAll(async () => {
    await app.shutdown()
  })

  test("Query missing a from with no pools", async () => {
    await app.find("role=button[name=create]").click()
    await app.find(':text("New Query Session")').click()
    const msg = await app.find(':text("Load data into a pool")')
    expect(msg).toBeDefined()
  })

  test("Query missing a from with some pools", async () => {
    await app.createPool([getPath("small-zeek.zng")])
    await app.find("role=button[name=create]").click()
    await app.find(':text("New Query Session")').click()
    const msg = await app.find(':text("click one of the pools")')
    expect(msg).toBeDefined()
    const list = await app.find("role=list[name=from-pin-list]")
    expect(list).toBeDefined()
    await app.find("role=listitem[name=small-zeek.zng]").click()
    const stats = await app.getViewerStats()
    expect(stats).toEqual({results: 31, shapes: 8})
  })
})
