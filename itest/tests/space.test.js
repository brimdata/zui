/* @flow */

import {basename} from "path"

import {
  getCurrentSpace,
  logIn,
  newAppInstance,
  resetState,
  startApp
} from "../lib/app.js"
import {handleError, stdTest} from "../lib/jest.js"

describe("Spaces tests", () => {
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

  stdTest("default space is corelight", (done) => {
    logIn(app)
      .then(() => getCurrentSpace(app))
      .then((spaceName) => {
        expect(spaceName).toBe("corelight")
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })
})
