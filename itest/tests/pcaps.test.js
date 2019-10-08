/* @flow */

import {basename} from "path"

import {
  logIn,
  newAppInstance,
  resetState,
  rightClick,
  startApp,
  startSearch,
  waitForSearch,
  writeSearch
} from "../lib/app.js"
import {handleError, stdTest} from "../lib/jest.js"
import {dataSets, selectors} from "../../src/js/test/integration"

describe("Test PCAPs", () => {
  let app
  let testIdx = 0
  beforeEach(() => {
    app = newAppInstance(basename(__filename), ++testIdx)
    return startApp(app)
  })

  afterEach(async () => {
    if (app && app.isRunning()) {
      await resetState(app)
      return await app.stop()
    }
  })

  stdTest("Download PCAPS menu item appears with conn log items", (done) => {
    let getRightClickFromConnTuple = async () => {
      await logIn(app)
      await writeSearch(app, "_path=conn duration!=nil | sort -r ts, uid")
      await startSearch(app)
      await waitForSearch(app)
      return await rightClick(
        app,
        selectors.viewer.resultCellContaining(
          dataSets.corelight.pcaps.setDurationUid
        )
      )
    }
    getRightClickFromConnTuple()
      .then(async () => {
        await app.client.waitForVisible(
          selectors.viewer.rightClickMenuItem("Download PCAPS")
        )
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })
})
