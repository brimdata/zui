/* @flow */

import {
  appInit,
  getCurrentSpace,
  logIn,
  newAppInstance,
  waitForHistogram,
  waitForSearch
} from "../lib/app.js"
import {handleError, stdTest} from "../lib/jest.js"

describe("Spaces tests", () => {
  let app
  beforeEach(() => {
    app = newAppInstance()
    return appInit(app)
  })

  afterEach(() => {
    if (app && app.isRunning()) {
      return app.stop()
    }
  })

  stdTest("default space is default", (done) => {
    logIn(app)
      .then(() => waitForHistogram(app))
      .then(() => waitForSearch(app))
      .then(() => getCurrentSpace(app))
      .then((spaceName) => {
        expect(spaceName).toBe("default")
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })
})
