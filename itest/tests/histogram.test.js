/* @flow */

import {
  appInit,
  logIn,
  newAppInstance,
  setSpan,
  waitForHistogram,
  waitForSearch
} from "../lib/app.js"
import {retryUntil} from "../lib/control.js"
import {handleError, stdTest} from "../lib/jest.js"
import {dataSets, selectors} from "../../src/js/test/integration"
import {LOG} from "../lib/log"

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
    app = newAppInstance()
    return appInit(app)
  })

  afterEach(() => {
    if (app && app.isRunning()) {
      return app.stop()
    }
  })

  stdTest("histogram deep inspection", (done) => {
    // This is a data-sensitive test that assumes the histogram has corelight
    // data loaded. There are inline comments that explain the test's flow.
    LOG.debug("Pre-login")
    logIn(app)
      .then(() => waitForHistogram(app))
      .then(() => waitForSearch(app))
      .then(async () => {
        LOG.debug("Checking number of histogram rect elements")
        let result = await retryUntil(
          () => app.client.$$(selectors.histogram.rectElem),
          (rectElements) =>
            rectElements.length ===
            dataSets.corelight.histogram.defaultTotalRectCount
        ).catch(() => {
          throw new Error(
            "Histogram did not render the expected number of rect elements"
          )
        })
        LOG.debug("Got number of histogram rect elements")
        return result
      })
      .then(async () => {
        // Assuming we properly loaded corelight data into the default space, we
        // we must wait until the components of the histogram are rendered. This
        // means we must wait for a number of g elements and rect elements. Those
        // elements depend on both the dataset itself and the product's behavior.
        // For example, these values will change if the default time window
        // changes from the last 30 minutes.
        LOG.debug("Getting number of distinct _paths")
        let pathClasses = await retryUntil(
          () => app.client.getAttribute(selectors.histogram.gElem, "class"),
          (pathClasses) =>
            pathClasses.length ===
            dataSets.corelight.histogram.defaultDistinctPaths
        )
        LOG.debug("Got number of distinct _paths")
        expect(pathClasses.sort()).toMatchSnapshot()
        // Here is the meat of the test verification. Here we fetch all 4
        // attributes' values of all rect elements, in a 2-D array of _path and
        // attribute. We ensure all the values are positive in a REASONABLE
        // range. We do NOT validate absolutely correct attribute values (which
        // sets the size of a bar). That's best done with unit testing.
        // XXX I could not get failures in this nested hierarchy to
        // propagate without doing this using async / await. In some cases
        // exceptions were quashed; in others they were uncaught. I gave up
        // because I got this pattern to work.
        LOG.debug("Getting all rect elements")
        let allRectValues = await Promise.all(
          pathClasses.map(
            async (pathClass) => await verifyPathClassRect(app, pathClass)
          )
        )
        LOG.debug("Got all rect elements")
        expect(allRectValues.length).toBe(
          // Whereas we just counted g elements before, this breaks down rect
          // elements within their g parent, ensuring rect elements are of the
          // proper _path.
          dataSets.corelight.histogram.defaultDistinctPaths
        )
        LOG.debug("Ensuring all rect elements' attributes are sane")
        allRectValues.forEach((pathClass) => {
          // The 4 comes from each of x, y, width, height for a rect element.
          expect(pathClass.length).toBe(4)
          pathClass.forEach((attr) => {
            expect(attr.length).toBe(
              dataSets.corelight.histogram.defaultRectsPerClass
            )
          })
        })
        LOG.debug("Ensured all rect elements' attributes are sane")
        LOG.debug("Switching to 'Whole Space'")
        // Now set to "Whole Space" to make sure this histogram is redrawn.
        await setSpan(app, "Whole Space")
        LOG.debug("Switched to 'Whole Space'")
        // Just count a higher number of _paths, not all ~1500 rect elements.
        LOG.debug("Checking rect elements in Whole Space")
        await retryUntil(
          () => app.client.getAttribute(selectors.histogram.gElem, "class"),
          (pathClasses) =>
            pathClasses.length ===
            dataSets.corelight.histogram.wholeSpaceDistinctPaths
        )
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })
})
