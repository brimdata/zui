/* @flow */
import fsExtra from "fs-extra"

import dialog from "spectron-fake-dialog"
import path from "path"

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

  beforeAll(async () => {
    await fsExtra.remove("tmp")
    app = newAppInstance(path.basename(__filename), ++testIdx)
    dialog.apply(app)
    await startApp(app)
    await ingestFile(app, "sample.tsv")
    await fsExtra.ensureDir("tmp")
  })

  afterAll(async () => {
    if (app && app.isRunning()) await app.stop()
    await fsExtra.remove("tmp")
  })

  stdTest("clicking the button", async (done) => {
    let filePath = path.normalize("tmp/test-export-results.zng")
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
