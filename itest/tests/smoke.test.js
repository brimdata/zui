/* @flow */

import {basename} from "path"

import {handleError, stdTest} from "../lib/jest.js"
import {newAppInstance, resetState, startApp} from "../lib/app.js"
import {waitForNewTab} from "../lib/app"

describe("Smoke test", () => {
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

  stdTest("show the new tab page when you log in", (done) => {
    waitForNewTab(app)
      .then(() => {
        console.log("nice!")
        done()
      })
      .catch((err) => handleError(app, err, done))
  })
})
