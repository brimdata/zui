/* @flow */

// The purpose of this file is to demonstrate that basic Spectron interaction
// can work in a CI environment. The tests don't claim to be meaningful other
// than showing Spectron works in a headless environment.
//
// The setup/teardown was taken from
// https://github.com/electron/spectron/#usage

import {
  logIn,
  setSpan,
  waitForLoginAvailable,
  waitForHistogram,
  waitForSearch
} from "../lib/app.js"
import {retryUntil} from "../lib/control.js"
import {TestTimeout, handleError} from "../lib/jest.js"
import {dataSets, selectors} from "../../src/js/test/integration"

const Application = require("spectron").Application
const electronPath = require("electron") // Require Electron from the binaries included in node_modules.
const path = require("path")

const verifySingleRectAttr = (app, pathClass, attr) =>
  app.client.getAttribute(`.${pathClass} rect`, attr).then((vals) => {
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
    vals.forEach((val) => {
      expect(Number(val)).toBeGreaterThanOrEqual(
        dataSets.corelight.histogram.rectAttrMin
      )
      expect(Number(val)).toBeLessThan(dataSets.corelight.histogram.rectAttrMax)
    })
    return vals
  })

const verifyPathClassRect = (app, pathClass) =>
  Promise.all(
    ["x", "y", "width", "height"].map((attr) =>
      verifySingleRectAttr(app, pathClass, attr)
    )
  )

describe("Histogram tests", () => {
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
    "histogram deep inspection",
    (done) => {
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
            (pathClasses) =>
              pathClasses.length ===
              dataSets.corelight.histogram.defaultDistinctPaths
          ).catch((err) => {
            handleError(app, err, done)
          })
        )
        .then((pathClasses) =>
          retryUntil(
            () => app.client.$$(selectors.histogram.rectElem),
            (rectElements) =>
              rectElements.length ===
              dataSets.corelight.histogram.defaultTotalRectCount
          )
            .then(() => pathClasses)
            .catch((err) => {
              handleError(app, err, done)
            })
        )
        // Once we see all the g and rect elements, ensure the g elements'
        // classes are expected. This nominally ensures the different _path
        // values are present.
        .then((pathClasses) => {
          expect(pathClasses.sort()).toMatchSnapshot()
          return pathClasses
        })
        .then(async (pathClasses) => {
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
              async (pathClass) => await verifyPathClassRect(app, pathClass)
            )
          )
          expect(allRectValues.length).toBe(
            // Whereas we just counted g elements before, this breaks down rect
            // elements within their g parent, ensuring rect elements are of the
            // proper _path.
            dataSets.corelight.histogram.defaultDistinctPaths
          )
          allRectValues.forEach((pathClass) => {
            // The 4 comes from each of x, y, width, height for a rect element.
            expect(pathClass.length).toBe(4)
            pathClass.forEach((attr) => {
              expect(attr.length).toBe(
                dataSets.corelight.histogram.defaultRectsPerClass
              )
            })
          })
        })
        // Now set to "Whole Space" to make sure this histogram is redrawn.
        .then(() => setSpan(app, "Whole Space"))
        .then(() =>
          // Just count a higher number of _paths, not all ~1500 rect elements.
          retryUntil(
            () => app.client.getAttribute(selectors.histogram.gElem, "class"),
            (pathClasses) =>
              pathClasses.length ===
              dataSets.corelight.histogram.wholeSpaceDistinctPaths
          ).catch((err) => {
            handleError(app, err, done)
          })
        )
        .then(() => {
          done()
        })
        .catch((err) => {
          handleError(app, err, done)
        })
    },
    TestTimeout
  )
})
