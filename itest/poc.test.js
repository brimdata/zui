/* @flow */

// The purpose of this file is to demonstrate that basic Spectron interaction
// can work in a CI environment. The tests don't claim to be meaningful other
// than showing Spectron works in a headless environment.
//
// The setup/teardown was taken from
// https://github.com/electron/spectron/#usage

import {dataSets, selectors} from "../src/js/test/integration"

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

const retryUntil = (f, cond_f, attempts = 5, delay = 1000) =>
  // Retry f until cond_f is true. Return results from f.
  //
  // f: function that returns a promise
  // cond_f: function that expects f's resolved value and returns a Boolean.
  // If cond_f returns false, then f is retried. This attempts every delay ms
  // for attempts before rejecting.
  retry(
    () =>
      new Promise((resolve, reject) => {
        f()
          .then(val => {
            if (cond_f(val)) {
              resolve(val)
            } else {
              reject(new Error(`retryUntil condition failure: ${val}`))
            }
          })
          .catch(err => {
            reject(`retryUntil promise failure: ${err}`)
          })
      }),
    attempts,
    delay
  )

const verifySingleRectAttr = (app, pathClass, attr) =>
  app.client.getAttribute(`.${pathClass} rect`, attr).then(vals => {
    // Handle case of a single rect, in which case webdriver doesn't return an
    // array of 1 item but instead a scalar
    if (typeof vals === "string") {
      vals = [vals]
    }
    if (!Array.isArray(vals)) {
      throw new Error(
        `expected Array for ${pathClass} attr ${attr}; got ${vals}`
      )
    }
    vals.forEach(val => {
      expect(Number(val)).toBeGreaterThanOrEqual(
        dataSets.corelight.histogram.rectAttrMin
      )
      expect(Number(val)).toBeLessThan(dataSets.corelight.histogram.rectAttrMax)
    })
    return vals
  })

const verifyPathClassRect = (app, pathClass) =>
  Promise.all(
    ["x", "y", "width", "height"].map(attr =>
      verifySingleRectAttr(app, pathClass, attr)
    )
  )

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
  return retry(() =>
    app.client.element(selectors.histogram.topLevel).getAttribute("class")
  )
}

const handleError = async (app, initialError, done) => {
  let realError = undefined
  let notificationError = undefined
  console.log(`handleError: Test hit exception: ${initialError}`)
  console.log("handleError: Looking for any desktop app notifications")
  try {
    notificationError = await app.client.getText(selectors.notification)
  } catch {
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
  test(
    "shows a window with the correct title",
    done => {
      app.client
        .waitForExist("title")
        .then(() => app.client.getTitle())
        .then(title => {
          // TODO: Looky shouldn't be hardcoded but instead read from a title
          // defined elsewhere.
          expect(title).toBe("Looky")
          done()
        })
        .catch(err => {
          handleError(app, err, done)
        })
    },
    TestTimeout
  )

  test(
    "shows a window with the correct header text",
    done => {
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
        .catch(err => {
          handleError(app, err, done)
        })
    },
    TestTimeout
  )

  test(
    "log in and see Search and Histogram",
    done => {
      waitForLoginAvailable(app)
        .then(() => logIn(app))
        .then(() => waitForHistogram(app))
        .then(() => waitForSearch(app))
        .then(val => {
          expect(val).toBeDefined()
          done()
        })
        .catch(err => {
          handleError(app, err, done)
        })
    },
    TestTimeout
  )

  test(
    "histogram deep inspection",
    done => {
      // This is a data-sensitive test that assumes the histogram has corelight
      // data loaded. There are inline comments that explain the test's flow.
      waitForLoginAvailable(app)
        .then(() => logIn(app))
        .then(() => waitForHistogram(app))
        .then(() => waitForSearch(app))
        // Assuming we properly loaded corelight data into the default space, we
        // we must wait until the components of the histogram are rendered. This
        // means we must wait for a number of g elements and rect elements. Those
        // elements depend on both the dataset itself and the product's behavior.
        // For example, these values will change if the default time window
        // changes from the last 30 minutes.
        .then(() =>
          retryUntil(
            () => app.client.getAttribute(selectors.histogram.gElem, "class"),
            pathClasses =>
              pathClasses.length ===
              dataSets.corelight.histogram.defaultDistinctPaths
          ).catch(err => {
            handleError(app, err, done)
          })
        )
        .then(pathClasses =>
          retryUntil(
            () => app.client.$$(selectors.histogram.rectElem),
            rectElements =>
              rectElements.length ===
              dataSets.corelight.histogram.defaultTotalRectCount
          )
            .then(() => pathClasses)
            .catch(err => {
              handleError(app, err, done)
            })
        )
        // Once we see all the g and rect elements, ensure the g elements'
        // classes are expected. This nominally ensures the different _path
        // values are present.
        .then(pathClasses => {
          expect(pathClasses.sort()).toMatchSnapshot()
          return pathClasses
        })
        .then(async pathClasses => {
          // Here is the meat of the test verification. Here we fetch all 4
          // attributes' values of all rect elements, in a 2-D array of _path and
          // attribute. We ensure all the values are positive in a REASONABLE
          // range. We do NOT validate absolutely correct attribute values (which
          // sets the size of a bar). That's best done with unit testing.
          // XXX I could not get failures in this nested hierarchy to
          // propagate without doing this using async / await. In some cases
          // exceptions were quashed; in others they were uncaught. I gave up
          // because I got this pattern to work.
          let allRectValues = await Promise.all(
            pathClasses.map(
              async pathClass => await verifyPathClassRect(app, pathClass)
            )
          )
          expect(allRectValues.length).toBe(
            // Whereas we just counted g elements before, this breaks down rect
            // elements within their g parent, ensuring rect elements are of the
            // proper _path.
            dataSets.corelight.histogram.defaultDistinctPaths
          )
          allRectValues.forEach(pathClass => {
            // The 4 comes from each of x, y, width, height for a rect element.
            expect(pathClass.length).toBe(4)
            pathClass.forEach(attr => {
              expect(attr.length).toBe(
                dataSets.corelight.histogram.defaultRectsPerClass
              )
            })
          })
          done()
        })
        .catch(err => {
          handleError(app, err, done)
        })
    },
    TestTimeout
  )
})
