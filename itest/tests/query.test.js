/* @flow */

// The purpose of this file is to demonstrate that basic Spectron interaction
// can work in a CI environment. The tests don't claim to be meaningful other
// than showing Spectron works in a headless environment.
//
// The setup/teardown was taken from
// https://github.com/electron/spectron/#usage

import {logIn, waitForLoginAvailable, waitForHistogram, waitForSearch} from "../lib/app.js"
import {TestTimeout, handleError} from "../lib/jest.js"
import {selectors} from "../../src/js/test/integration"

const Application = require("spectron").Application
const electronPath = require("electron") // Require Electron from the binaries included in node_modules.
const path = require("path")

const writeSearch = (app, searchText) =>
  app.client.setValue(selectors.search.input, searchText)

const startSearch = (app) => app.client.click(selectors.search.button)

const searchDisplay = async (app) => {
  // This stinks. We have to use getHTML because headers that are off the
  // screen return as empty strings if you use getText. This isn't required of
  // actual results.
  // See http://v4.webdriver.io/api/property/getText.html
  // app.browserWindow.maximize() fixes the problem on my laptop but not CircleCI.
  // But what we get back includes the width which can be non-deterministic:
  // <div class="header-cell" style="width: 192px;">ts<div class="col-resizer"></div></div>
  // That style width will vary on my laptop vs. CircleCI.
  // The hack is to split this and extract just the text.
  // '<div class="header-cell" style="width: 192px;">ts<div // class="col-resizer"></div></div>'.split('>')[1].split('<')[0]

  const _trim = (s: string) => s.split(">")[1].split("<")[0]

  const headerResults = () => {
    return app.client.getHTML(selectors.viewer.headers).then((headers) => {
      if (typeof headers === "string") {
        headers = [headers]
      }
      return headers.map((h) => _trim(h))
    })
  }
  const searchResults = () => app.client.getText(selectors.viewer.results)

  let headers = await headerResults()
  let search = await searchResults()
  return headers.concat(search)
}

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
          done()
        })
        .catch((err) => {
          handleError(app, err, done)
        })
    },
    TestTimeout
  )
})
