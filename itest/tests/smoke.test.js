/* @flow */

import {basename} from "path"

import {
  newAppInstance,
  resetState,
  startApp,
  waitForSearch
} from "../lib/app.js"
import {handleError, stdTest} from "../lib/jest.js"

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

  stdTest("show a sane window; log in and see Search", (done) => {
    waitForSearch(app)
      .then((val) => {
        expect(val).toBeDefined()
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })
})
