/* @flow */

// The purpose of this file is to demonstrate that basic Spectron interaction
// can work in a CI environment. The tests don't claim to be meaningful other
// than showing Spectron works in a headless environment.
//
// The setup/teardown was taken from
// https://github.com/electron/spectron/#usage

import {logIn, waitForLoginAvailable, waitForHistogram, waitForSearch} from "../lib/app.js"
import {selectors} from "../../src/js/test/integration"

const Application = require("spectron").Application
const electronPath = require("electron") // Require Electron from the binaries included in node_modules.
const path = require("path")

const TestTimeout = 60000

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

  // TODO: Parallel runs across files are not supported due to chromebrowser
  // port contention. Support that later.
  test(
    "show a sane window; log in and see Search and Histogram",
    (done) => {
      waitForLoginAvailable(app)
        .then(() => app.client.waitForExist("title"))
        .then(() => app.client.getTitle())
        .then((title) => {
          // TODO: Looky shouldn't be hardcoded but instead read from a title
          // defined elsewhere.
          expect(title.toLowerCase()).toBe("looky")
        })
        .then(() => app.client.waitForExist(".looky-header h1"))
        // TODO: Don't use selectors as literals in tests. These definitions
        // should be defined in a single place and ideally be tested to ensure
        // they can be found.
        .then(() => app.client.getText(".looky-header h1"))
        .then((headerText) => {
          expect(headerText.toLowerCase()).toBe("looky")
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
    },
    TestTimeout
  )
})
