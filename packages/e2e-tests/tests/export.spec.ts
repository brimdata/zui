import {test, expect} from "@playwright/test"
import path from "path"
import {testDataDir} from "../helpers/env"
import TestApp from "../helpers/test-app"
import os from "os"
import fsExtra from "fs-extra"

const tempDir = os.tmpdir()
const formats = [
  {label: "Arrow IPC Stream", expectedSize: 46512},
  {label: "CSV", expectedSize: 10851},
  {label: "JSON", expectedSize: 13659},
  {label: "NDJSON", expectedSize: 13657},
  {label: "VNG", expectedSize: 6794},
  {label: "Zeek", expectedSize: 9772},
  {label: "ZJSON", expectedSize: 18007},
  {label: "ZNG", expectedSize: 3744},
  {label: "ZSON", expectedSize: 15137},
]

test.describe("Export tests", () => {
  const app = new TestApp("Export tests")

  test.beforeAll(async () => {
    await app.init()
    await app.createPool([
      path.normalize(path.join(testDataDir(), "sample.tsv")),
    ])
    await app.mainWin.getByRole("button", {name: "Query Pool"}).click()
    await app.query("sort ts")
  })

  test.afterAll(async () => {
    await app.shutdown()
  })

  formats.forEach(({label, expectedSize}) => {
    test(`Exporting in ${label} format succeeds`, async () => {
      const file = path.join(tempDir, `results.${label}`)

      app.zui.evaluate(async ({dialog}, filePath) => {
        dialog.showSaveDialog = () =>
          Promise.resolve({canceled: false, filePath})
      }, file)

      const menu = app.mainWin.getByRole("list", {name: "resultsToolbarMenu"})
      await menu.getByRole("button", {name: "Export"}).click()
      const dialog = app.mainWin.getByRole("dialog")
      await dialog.getByRole("radio", {name: `${label}`}).click()
      await dialog.getByRole("button").filter({hasText: "Export"}).click()
      await app.mainWin
        .getByText(new RegExp("Export Completed: .*results." + label))
        .waitFor()

      expect(fsExtra.statSync(file).size).toBe(expectedSize)
    })
  })
})
