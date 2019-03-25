/* @flow */

// The purpose of this file is to demonstrate that basic Spectron interaction
// can work in a CI environment. The tests don't claim to be meaningful other
// than showing Spectron works in a headless environment.
//
// The setup/teardown was taken from
// https://github.com/electron/spectron/#usage

const Application = require("spectron").Application
const electronPath = require("electron") // Require Electron from the binaries included in node_modules.
const path = require("path")

const TestTimeout = 60000

const retry = (f, attempts = 100, delay = 100) => {
  return new Promise((resolve, reject) => {
    f()
      .then(ret => resolve(ret))
      .catch(err => {
        setTimeout(() => {
          if (attempts === 1) {
            reject(err)
          } else {
            retry(f, attempts - 1, delay)
              .then(ret => resolve(ret))
              .catch(err => reject(err))
          }
        }, delay)
      })
  })
}

const logIn = app => {
  return app.client
    .setValue("[name=host]", "localhost")
    .setValue("[name=port]", "9867")
    .click("button")
}

const waitForLoginAvailable = app => {
  const waitForHostname = () => {
    return app.client.waitForExist("[name=host]")
  }
  const waitForPort = () => {
    return app.client.waitForExist("[name=port]")
  }
  const waitForButton = () => {
    return app.client.waitForExist("button")
  }
  return waitForHostname()
    .then(() => waitForPort())
    .then(() => waitForButton())
}

const waitForSearch = app => {
  return retry(() => app.client.element("#main-search-input").getValue())
}

const waitForHistogram = app => {
  return retry(() => app.client.element(".count-by-time").getAttribute("class"))
}

describe("Application launch", () => {
  let app
  beforeEach(() => {
    // TODO: Move this logic into a library, especially as it expands.
    app = new Application({
      path: electronPath,
      args: [path.join(__dirname, "..")]
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
  test("shows a window with the correct title", done => {
    app.client
      .waitForExist("title")
      .then(() => app.client.getTitle())
      .then(title => {
        // TODO: Looky shouldn't be hardcoded but instead read from a title
        // defined elsewhere.
        expect(title).toBe("Looky")
        done()
      })
      .catch(done)
  }, TestTimeout)

  test("shows a window with the correct header text", done => {
    app.client
      .waitForExist(".looky-header h1")
      // TODO: Don't use selectors as literals in tests. These definitions
      // should be defined in a single place and ideally be tested to ensure
      // they can be found.
      .then(() => app.client.getText(".looky-header h1"))
      .then(headerText => {
        expect(headerText).toBe("LOOKY")
        done()
      })
      .catch(done)
  }, TestTimeout)

  test("log in and see Search and Histogram", done => {
    waitForLoginAvailable(app)
      .then(() => logIn(app))
      .then(() => waitForHistogram(app))
      .then(() => waitForSearch(app))
      .then(val => {
        expect(val).toBeDefined()
        done()
      })
      .catch(done)
  }, TestTimeout)
})
