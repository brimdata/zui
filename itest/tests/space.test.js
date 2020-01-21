/* @flow */

import {basename} from "path"

import {
  getCurrentSpace,
  logIn,
  newAppInstance,
  resetState,
  searchDisplay,
  setSpace,
  setSpan,
  startApp,
  startSearch,
  waitForSearch,
  writeSearch
} from "../lib/app.js"
import {handleError, stdTest} from "../lib/jest.js"
import {dataSets} from "../../src/js/test/integration"

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

  stdTest(`default space is ${dataSets.hq_integration.spaceName}`, (done) => {
    logIn(app)
      .then(() => getCurrentSpace(app))
      .then((spaceName) => {
        expect(spaceName).toBe(dataSets.corelight.spaceName)
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })

  stdTest(`change space to ${dataSets.hq_integration.spaceName}`, (done) => {
    logIn(app)
      .then(() => setSpace(app, dataSets.hq_integration.spaceName))
      .then(() => getCurrentSpace(app))
      .then((spaceName) => {
        expect(spaceName).toBe(dataSets.hq_integration.spaceName)
      })
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
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })
})
