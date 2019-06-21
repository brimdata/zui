/* @flow */

const electronPath = require("electron")

import {Application} from "spectron"
import * as path from "path"

import {
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
import {dataSets, selectors} from "../../src/js/test/integration"
import {retry} from "../lib/control"

describe("Correlation tests", () => {
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

  test(
    "conn for www.mybusinessdoc.com is found via correlation",
    (done) => {
      waitForLoginAvailable(app)
        .then(() => logIn(app))
        .then(() => waitForHistogram(app))
        .then(() => waitForSearch(app))
        .then(() => setSpan(app, dataSets.corelight.logDetails.span))
        .then(() =>
          writeSearch(app, dataSets.corelight.logDetails.initialSearch)
        )
        .then(() => startSearch(app))
        .then(() => waitForSearch(app))
        .then(() => searchDisplay(app))
        .then((results) => {
          expect(results).toMatchSnapshot()
        })
        .then(() =>
          app.client.rightClick(
            selectors.viewer.resultCellContaining(
              dataSets.corelight.logDetails.getDetailsFrom
            )
          )
        )
        .then(() =>
          app.client.click(selectors.viewer.rightClickMenuItem("Open details"))
        )
        .then(() =>
          Promise.all([
            retry(() => app.client.getText(selectors.correlationPanel.tsLabel)),
            retry(() => app.client.getText(selectors.correlationPanel.pathTag)),
            retry(() =>
              app.client.getText(selectors.correlationPanel.duration)
            ).then((result) => [result])
          ])
        )
        .then((correlationData) => {
          expect(correlationData).toMatchSnapshot()
          done()
        })
        .catch((err) => {
          handleError(app, err, done)
        })
    },
    TestTimeout
  )
})
