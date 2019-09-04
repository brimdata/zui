/* @flow */

// The purpose of this file is to demonstrate that basic Spectron interaction
// can work in a CI environment. The tests don't claim to be meaningful other
// than showing Spectron works in a headless environment.
//
// The setup/teardown was taken from
// https://github.com/electron/spectron/#usage

import {
  appInit,
  logIn,
  newAppInstance,
  waitForHistogram,
  waitForSearch
} from "../lib/app.js"
import {handleError, stdTest} from "../lib/jest.js"

describe("Smoke test", () => {
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

  // TODO: Parallel runs across files are not supported due to chromebrowser
  // port contention. Support that later.
  stdTest("show a sane window; log in and see Search and Histogram", (done) => {
    app.client
      .waitForExist("title")
      .then(() => app.client.getTitle())
      .then((title) => {
        // TODO: Brim shouldn't be hardcoded but instead read from a title
        // defined elsewhere.
        expect(title.toLowerCase()).toBe("brim")
      })
      .then(() => app.client.waitForExist(".brand h1"))
      // TODO: Don't use selectors as literals in tests. These definitions
      // should be defined in a single place and ideally be tested to ensure
      // they can be found.
      .then(() => app.client.getText(".brand h1"))
      .then((headerText) => {
        expect(headerText.toLowerCase()).toBe("welcome to brim")
      })
      .then(() => logIn(app))
      .then(() => waitForHistogram(app))
      .then(() => waitForSearch(app))
      .then((val) => {
        expect(val).toBeDefined()
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })
})
