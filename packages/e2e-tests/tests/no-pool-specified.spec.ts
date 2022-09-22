import {test, expect} from "@playwright/test"
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
    await app.find("role=button[name=run-query]").click()
    await app.sleep(5000)
  })
})
