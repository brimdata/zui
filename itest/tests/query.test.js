/* @flow */

// The purpose of this file is to demonstrate that basic Spectron interaction
// can work in a CI environment. The tests don't claim to be meaningful other
// than showing Spectron works in a headless environment.
//
// The setup/teardown was taken from
// https://github.com/electron/spectron/#usage

import {
  getSearchSpeed,
  getSearchTime,
  logIn,
  searchDisplay,
  setSpan,
  startSearch,
  waitForLoginAvailable,
  waitForHistogram,
  waitForSearch,
  writeSearch
} from "../lib/app.js"
import {TestTimeout, handleError} from "../lib/jest.js"

const Application = require("spectron").Application
const electronPath = require("electron") // Require Electron from the binaries included in node_modules.
const path = require("path")

describe("Query tests", () => {
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
    "query path=weird | sort",
    (done) => {
      waitForLoginAvailable(app)
        .then(() => logIn(app))
        .then(() => waitForHistogram(app))
        .then(() => waitForSearch(app))
        .then(() => writeSearch(app, "_path=weird | sort"))
        .then(() => startSearch(app))
        .then(() => waitForSearch(app))
        .then(() => searchDisplay(app))
        .then((results) => {
          expect(results).toMatchSnapshot()
        })
        .then(() => getSearchSpeed(app))
        .then((searchSpeed) => {
          expect(searchSpeed).toBeGreaterThan(0)
          expect(searchSpeed).toBeLessThan(1000)
        })
        .then(() => getSearchTime(app))
        .then((searchTime) => {
          expect(searchTime).toBeGreaterThan(0)
          expect(searchTime).toBeLessThan(5)
          done()
        })
        .catch((err) => {
          handleError(app, err, done)
        })
    },
    TestTimeout
  )

  test(
    "query path=_http | count()",
    (done) => {
      waitForLoginAvailable(app)
        .then(() => logIn(app))
        .then(() => waitForHistogram(app))
        .then(() => waitForSearch(app))
        .then(() => writeSearch(app, "_path=http | count()"))
        .then(() => startSearch(app))
        .then(() => waitForSearch(app))
        .then(() => searchDisplay(app))
        .then((results) => {
          expect(results).toMatchSnapshot()
        })
        .then(() => getSearchSpeed(app))
        .then((searchSpeed) => {
          expect(searchSpeed).toBeGreaterThan(0)
          expect(searchSpeed).toBeLessThan(1000)
        })
        .then(() => getSearchTime(app))
        .then((searchTime) => {
          expect(searchTime).toBeGreaterThan(0)
          expect(searchTime).toBeLessThan(5)
          done()
        })
        .catch((err) => {
          handleError(app, err, done)
        })
    },
    TestTimeout
  )

  test(
    "query _path=http | count() by id.resp_p | sort",
    (done) => {
      waitForLoginAvailable(app)
        .then(() => logIn(app))
        .then(() => waitForHistogram(app))
        .then(() => waitForSearch(app))
        .then(() =>
          writeSearch(app, "_path=http | count() by id.resp_p | sort")
        )
        .then(() => startSearch(app))
        .then(() => waitForSearch(app))
        .then(() => searchDisplay(app))
        .then((results) => {
          expect(results).toMatchSnapshot()
        })
        .then(() => getSearchSpeed(app))
        .then((searchSpeed) => {
          expect(searchSpeed).toBeGreaterThan(0)
          expect(searchSpeed).toBeLessThan(1000)
        })
        .then(() => getSearchTime(app))
        .then((searchTime) => {
          expect(searchTime).toBeGreaterThan(0)
          expect(searchTime).toBeLessThan(5)
          done()
        })
        .catch((err) => {
          handleError(app, err, done)
        })
    },
    TestTimeout
  )

  test(
    "query _path=http | every 5m count()",
    (done) => {
      waitForLoginAvailable(app)
        .then(() => logIn(app))
        .then(() => waitForHistogram(app))
        .then(() => waitForSearch(app))
        .then(() => writeSearch(app, "_path=http | every 5m count()"))
        .then(() => startSearch(app))
        .then(() => waitForSearch(app))
        .then(() => searchDisplay(app))
        .then((results) => {
          expect(results).toMatchSnapshot()
        })
        .then(() => getSearchSpeed(app))
        .then((searchSpeed) => {
          expect(searchSpeed).toBeGreaterThan(0)
          expect(searchSpeed).toBeLessThan(1000)
        })
        .then(() => getSearchTime(app))
        .then((searchTime) => {
          expect(searchTime).toBeGreaterThan(0)
          expect(searchTime).toBeLessThan(5)
          done()
        })
        .catch((err) => {
          handleError(app, err, done)
        })
    },
    TestTimeout
  )

  test(
    "query * | count(); switch to whole space",
    (done) => {
      waitForLoginAvailable(app)
        .then(() => logIn(app))
        .then(() => waitForHistogram(app))
        .then(() => waitForSearch(app))
        .then(() => writeSearch(app, "* | count()"))
        .then(() => startSearch(app))
        .then(() => waitForSearch(app))
        .then(() => searchDisplay(app))
        .then((results) => {
          expect(results).toMatchSnapshot()
        })
        .then(() => setSpan(app, "Whole Space"))
        .then(() => waitForSearch(app))
        .then(() => searchDisplay(app))
        .then((results) => {
          expect(results).toMatchSnapshot()
        })
        .then(() => getSearchSpeed(app))
        .then((searchSpeed) => {
          expect(searchSpeed).toBeGreaterThan(0)
          expect(searchSpeed).toBeLessThan(1000)
        })
        .then(() => getSearchTime(app))
        .then((searchTime) => {
          expect(searchTime).toBeGreaterThan(0)
          expect(searchTime).toBeLessThan(5)
          done()
        })
        .catch((err) => {
          handleError(app, err, done)
        })
    },
    TestTimeout
  )
})
