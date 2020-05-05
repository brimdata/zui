/* @flow */

import {basename} from "path"

import {
  click,
  newAppInstance,
  pcapIngestSample,
  rightClick,
  searchDisplay,
  setSpan,
  startApp,
  startSearch,
  waitForResults,
  writeSearch
} from "../lib/app.js"
import {handleError, stdTest} from "../lib/jest.js"
import {selectors} from "../../src/js/test/integration"

describe("Test search mods via right-clicks", () => {
  let app
  let testIdx = 0

  beforeAll(async () => {
    app = newAppInstance(basename(__filename), ++testIdx)
    await startApp(app)
    await pcapIngestSample(app)
    await setSpan(app, "Whole Space")
  })

  afterAll(async () => {
    if (app && app.isRunning()) {
      await app.stop()
    }
  })

  beforeEach(async () => {
    await writeSearch(app, "")
    await startSearch(app)
    await waitForResults(app)
  })

  stdTest("count by _path; sort asc", (done) => {
    rightClick(app, selectors.viewer.resultCellContaining("capture_loss"))
      .then(async () => {
        await click(app, selectors.viewer.contextMenuItem("Count by field"))
        await rightClick(app, selectors.viewer.resultCellContaining("dns"))
        await click(app, selectors.viewer.contextMenuItem("Sort A...Z"))
        let results = await searchDisplay(app)
        expect(results).toMatchSnapshot()
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })
})
