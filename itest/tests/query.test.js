/* @flow */

import {basename} from "path"

import {
  getSearchSpeed,
  getSearchTime,
  logIn,
  newAppInstance,
  resetState,
  searchDisplay,
  setSpan,
  startApp,
  startSearch,
  waitForSearch,
  writeSearch
} from "../lib/app.js"
import {handleError, stdTest} from "../lib/jest.js"

describe("Query tests", () => {
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

  stdTest('query "_path=weird | sort"', (done) => {
    logIn(app)
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
  })

  stdTest('query "_path=http | count()"', (done) => {
    logIn(app)
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
  })

  stdTest('query "_path=http | count() by id.resp_p | sort"', (done) => {
    logIn(app)
      .then(() => writeSearch(app, "_path=http | count() by id.resp_p | sort"))
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
  })

  stdTest('query "_path=http | every 5m count()"', (done) => {
    logIn(app)
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
  })

  stdTest('query "* | count()"; switch to whole space', (done) => {
    logIn(app)
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
  })
})
