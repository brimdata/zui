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

describe("Application launch", () => {
  let app
  beforeEach(() => {
    // TODOs:
    // 1. Move this logic into a library, especially as it expands.
    // 2. "Reset State" will surely be necessary.
    app = new Application({
      path: electronPath,
      args: [path.join(__dirname, "..")]
    })
    return app.start()
  })

  afterEach(() => {
    if (app && app.isRunning()) {
      return app.stop()
    }
  })

  // Describe two tests. We choose two to ensure application launch/teardown
  // works in a CI environment.
  // TODO: Parallel runs across files are not supported due to chromebrowser
  // port contention. Support that later.
  test("shows a window with the correct title", done => {
    app.client
      .getTitle()
      .then(title => {
        // TODO: Looky shouldn't be hardcoded but instead read from a title
        // defined elsewhere.
        expect(title).toBe("Looky")
        done()
      })
      .catch(done)
  })

  test("shows a window with the correct header text", done => {
    app.client
      // TODO: Don't use selectors as literals in tests. These definitions
      // should be defined in a single place and ideally be tested to ensure
      // they can be found.
      .getText("//header[@class='looky-header']/h1")
      .then(headerText => {
        expect(headerText).toBe("LOOKY")
        done()
      })
      .catch(done)
  })
})
