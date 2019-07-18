/* @flow */

const electronPath = require("electron")

import {Application} from "spectron"
import * as path from "path"

import {
  getCurrentSpace,
  logIn,
  waitForLoginAvailable,
  waitForHistogram,
  waitForSearch
} from "../lib/app.js"
import {handleError, stdTest} from "../lib/jest.js"

describe("Spaces tests", () => {
  let app
  beforeEach(() => {
    app = new Application({
      path: electronPath,
      args: [path.join(__dirname, "..", "..")]
    })
    return app.start().then(() => app.webContents.send("resetState"))
  })

  afterEach(() => {
    if (app && app.isRunning()) {
      return app.stop()
    }
  })

  stdTest("default space is default", (done) => {
    waitForLoginAvailable(app)
      .then(() => logIn(app))
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
