/* @flow */

// The purpose of this file is to demonstrate that basic Spectron interaction
// can work in a CI environment. The tests don't claim to be meaningful other
// than showing Spectron works in a headless environment.
//
// The setup/teardown was taken from
// https://github.com/electron/spectron/#usage

import {logIn, startSearch, searchDisplay, waitForLoginAvailable, waitForSearch, writeSearch} from "../lib/app.js"
import {TestTimeout, handleError} from "../lib/jest.js"
import {selectors} from "../../src/js/test/integration"

const Application = require("spectron").Application
const electronPath = require("electron") // Require Electron from the binaries included in node_modules.
const path = require("path")

describe("Application launch", () => {
  let app
  beforeEach(() => {
    // TODO: Move this logic into a library, especially as it expands.
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

  test(
    "reset state after query works",
    (done) => {
      waitForLoginAvailable(app)
        .then(() => logIn(app))
        .then(() => waitForSearch(app))
        .then(() => writeSearch(app, "_path=http | count()"))
        .then(() => startSearch(app))
        .then(() => waitForSearch(app))
        .then(() => searchDisplay(app))
        .then((results) => {
          expect(results).toBeTruthy()
        })
        .then(() => app.webContents.send("resetState"))
        .then(() => waitForLoginAvailable(app))
        .then(() => app.client.getValue(selectors.login.host))
        .then((host) => {
          expect(host).toBe("")
        })
        .then(() => app.client.getValue(selectors.login.port))
        .then((port) => {
          expect(port).toBe("")
        })
        .then(() => logIn(app))
        .then(() => waitForSearch(app))
        .then(() => app.client.getValue(selectors.search.input))
        .then((val) => {
          expect(val).toBe("")
          done()
        })
        .catch((err) => {
          handleError(app, err, done)
        })
    },
    TestTimeout
  )
})
