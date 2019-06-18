/* @flow */

// The purpose of this file is to demonstrate that basic Spectron interaction
// can work in a CI environment. The tests don't claim to be meaningful other
// than showing Spectron works in a headless environment.
//
// The setup/teardown was taken from
// https://github.com/electron/spectron/#usage

import {retry} from "../lib/control.js"
import {selectors} from "../../src/js/test/integration"

const Application = require("spectron").Application
const electronPath = require("electron") // Require Electron from the binaries included in node_modules.
const path = require("path")

const TestTimeout = 60000

const logIn = (app) => {
  return app.client
    .setValue(selectors.login.host, "localhost")
    .setValue(selectors.login.port, "9867")
    .click(selectors.login.button)
}

const waitForLoginAvailable = (app) => {
  const waitForHostname = () => {
    return app.client.waitForExist(selectors.login.host)
  }
  const waitForPort = () => {
    return app.client.waitForExist(selectors.login.port)
  }
  const waitForButton = () => {
    return app.client.waitForExist(selectors.login.button)
  }
  return waitForHostname()
    .then(() => waitForPort())
    .then(() => waitForButton())
}

const waitForSearch = (app) => {
  return retry(() => app.client.element("#main-search-input").getValue())
}

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

const handleError = async (app, initialError, done) => {
  let realError = undefined
  let notificationError = undefined
  console.log(`handleError: Test hit exception: ${initialError}`)
  console.log("handleError: Looking for any desktop app notifications")
  try {
    notificationError = await app.client.getHTML(selectors.notification, false)
  } catch (e) {
    notificationError = undefined
  }
  if (notificationError) {
    realError = new Error(
      "App notification '" +
        notificationError +
        "' (initial error: '" +
        initialError +
        "'"
    )
  } else {
    console.log("handleError: desktop app notification not found")
    realError = initialError
  }
  done.fail(realError)
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
