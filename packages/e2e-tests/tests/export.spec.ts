import {test, expect} from "@playwright/test"
import path from "path"
import {testDataDir} from "../helpers/env"
import TestApp from "../helpers/test-app"
import os from "os"
import fsExtra from "fs-extra"

const tempDir = os.tmpdir()
const formats = [
  {label: "ZNG", expectedSize: 3744},
  {label: "ZSON", expectedSize: 15137},
  {label: "ZJSON", expectedSize: 18007},
  {label: "Zeek", expectedSize: 9772},
  {label: "JSON", expectedSize: 13659},
  {label: "NDJSON", expectedSize: 13657},
  {label: "CSV", expectedSize: 12208},
]

test.describe("Export tests", () => {
  const app = new TestApp("Export tests")

  test.beforeAll(async () => {
    await app.init()
    await app.createPool([
      path.normalize(path.join(testDataDir(), "sample.tsv")),
    ])
    await app.mainWin
      .locator('#app-root button:above(:text("Query Pool"))')
      .first()
      .click()
    await app.query("sort ts")
  })

  test.afterAll(async () => {
    await app.shutdown()
  })

  formats.forEach(({label, expectedSize}) => {
    test(`Exporting in ${label} format succeeds`, async () => {
      const file = path.join(tempDir, `results.${label}`)

      app.brim.evaluate(async ({dialog}, filePath) => {
        dialog.showSaveDialog = () =>
          Promise.resolve({canceled: false, filePath})
      }, file)

      await app.mainWin
        .locator('#app-root button:above(:text("Export"))')
        .first()
        .click()
      await app.mainWin.getByRole("radio", {name: `${label}`}).click()
      await app.mainWin.getByRole("button").filter({hasText: "Export"}).click()

      await expect(
        await app.mainWin.locator("text=Export Complete").first()
      ).toBeVisible()

      expect(fsExtra.statSync(file).size).toBe(expectedSize)
    })
  })
})
