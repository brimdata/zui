import {expect, test} from "@playwright/test"
import {getPath} from "packages/zui-test-data"
import TestApp from "../helpers/test-app"

test.describe("Table Testing", () => {
  const app = new TestApp("Table Testing")

  test.beforeAll(async () => {
    await app.init()
  })

  test.afterAll(async () => {
    await app.shutdown()
  })

  test("named type shows columns", async () => {
    const path = getPath("named-type.zson")
    await app.createPool([path])
    await app.mainWin.getByRole("button", {name: "Query Pool"}).click()
    await app.query("yield value.after") // This is a named type
    const columnheader = app.results.getByRole("columnheader")
    await columnheader.first().waitFor()
    const texts = await columnheader.allInnerTexts()
    expect(texts).toEqual(["Id", "IsDeleted"])
  })
})
