/* @flow */
import fsExtra from "fs-extra"

import dialog from "spectron-fake-dialog"
import os from "os"
import path from "path"
import fs from "fs"
import {
  click,
  ingestFile,
  newAppInstance,
  startApp,
  startSearch,
  writeSearch
} from "../lib/app"
import {retryUntil} from "../lib/control"
import {selectors} from "../../src/js/test/integration"
import {stdTest} from "../lib/jest"

describe("test exporting results", () => {
  let app
  let testIdx = 0
  let prefix = path.join(os.tmpdir(), "export_results-")
  let tmp

  beforeAll(async () => {
    tmp = fs.mkdtempSync(prefix)
    app = newAppInstance(path.basename(__filename), ++testIdx)
    dialog.apply(app)
    await startApp(app)
    await ingestFile(app, "sample.tsv")
  })

  afterAll(async () => {
    fsExtra.remove(tmp)
    if (app && app.isRunning()) await app.stop()
  })

  stdTest("clicking the button", async (done) => {
    let filePath = path.join(tmp, "results.zng")
    dialog.mock([
      {
        method: "showSaveDialog",
        value: {
          canceled: false,
          filePath
        }
      }
    ])
    await writeSearch(app, "")
    await startSearch(app)
    await click(app, selectors.export.button)
    await retryUntil(
      () => app.client.getText(selectors.infoNotice),
      (text) => /export complete/i.test(text)
    )
    let stats = fsExtra.statSync(filePath)
    expect(stats.size).toBeGreaterThan(0)
    done()
  })
})
