import fsExtra from "fs-extra"

import os from "os"
import path from "path"

import {brimQueryLib} from "../helpers/locators"
import createTestBrim from "../helpers/createTestBrim"
import waitForHook from "test/integration/helpers/appStep/api/waitForHook"

const filePath = path.join(os.tmpdir(), "myQueries.json")

describe("exporting queries tests", () => {
  const brim = createTestBrim("exportQueries")

  beforeAll(() => brim.ingest("sample.tsv"))

  test("clicking the export button", async (done) => {
    await brim.mockSaveDialog({canceled: false, filePath})
    await brim.rightClick(brimQueryLib.css)
    await brim.clickContextMenuItem("Export Folder as JSON")
    await waitForHook(brim.getApp(), "queries-export-complete")

    expect(fsExtra.statSync(filePath).size).toBe(2888)
    await fsExtra.remove(filePath)
    done()
  })

  test("canceling the export", async (done) => {
    await brim.mockSaveDialog({canceled: true, filePath: undefined})
    await brim.rightClick(brimQueryLib.css)
    await brim.clickContextMenuItem("Export Folder as JSON")
    await brim.wait(1)

    expect(await fsExtra.pathExists(filePath)).toBe(false)
    done()
  })
})
