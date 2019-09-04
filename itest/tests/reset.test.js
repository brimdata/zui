/* @flow */

import {
  startApp,
  logIn,
  newAppInstance,
  startSearch,
  searchDisplay,
  waitForLoginAvailable,
  waitForSearch,
  writeSearch
} from "../lib/app.js"
import {handleError, stdTest} from "../lib/jest.js"
import {selectors} from "../../src/js/test/integration"

describe("Reset state tests", () => {
  let app
  beforeEach(() => {
    app = newAppInstance()
    return startApp(app)
  })

  afterEach(() => {
    if (app && app.isRunning()) {
      return app.stop()
    }
  })

  stdTest("reset state after query works", (done) => {
    logIn(app)
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
  })
})
