/* @flow */

import {
  startApp,
  logIn,
  newAppInstance,
  resetState,
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

  afterEach(async () => {
    if (app && app.isRunning()) {
      await resetState(app)
      return await app.stop()
    }
  })

  stdTest("reset state after query works", (done) => {
    logIn(app)
      .then(() => writeSearch(app, "_path=http | count()"))
      .then(() => startSearch(app))
      .then(() => waitForSearch(app))
      .then(() => searchDisplay(app))
      .then((results) => {
        expect(results).toBeTruthy()
      })
      .then(() => resetState(app))
      .then(() => waitForLoginAvailable(app))
      // This call is safe because of the waitForLoginAvailable call above.
      .then(() => app.client.getValue(selectors.login.host))
      .then((host) => {
        expect(host).toBe("")
      })
      // This call is safe because of the waitForLoginAvailable call above.
      .then(() => app.client.getValue(selectors.login.port))
      .then((port) => {
        expect(port).toBe("")
      })
      .then(() => logIn(app))
      .then(() => waitForSearch(app))
      // This call is safe because of the waitForSearch call above.
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
