import {basename} from "path"

import appStep from "../lib/appStep/api"
import newAppInstance from "../lib/newAppInstance"
import {retryUntil} from "../lib/control"
import {handleError, stdTest} from "../lib/jest"
import {selectors} from "../../src/js/test/integration"
import {LOG} from "../lib/log"
import {quitBrim} from "../lib/stop"

describe("Histogram tests", () => {
  let app
  let testIdx = 0
  beforeAll(async (done) => {
    app = newAppInstance(basename(__filename), ++testIdx)
    await appStep.startApp(app)
    done()
  })

  afterAll(() => quitBrim(app))

  stdTest("histogram deep inspection", (done) => {
    LOG.debug("Pre-login")
    appStep
      .ingestFile(app, "sample.pcap")
      .then(async () => {
        LOG.debug("Checking a histogram appears")
        // Verify that a histogram of at least *partial data* is present.
        await retryUntil(
          () => app.client.$$(selectors.histogram.rectElem),
          (rectElements) => rectElements.length > 0
        ).catch(() => {
          throw new Error("Initial histogram did not render any rect elements")
        })
        LOG.debug("Got number of histogram rect elements")
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })
})
