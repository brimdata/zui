import "regenerator-runtime/runtime"
import {LOG} from "../helpers/log"

// This signals the path setup in main.js to not override the userData
// directory it sees on startup, so that we can store complete application
// state and logs for each individual integration test. It also signals not
// try to install the dev tools.
process.env.BRIM_ITEST = "true"

beforeEach(() => {
  LOG.info(`Starting Test: ${expect.getState().currentTestName}`)
})

afterEach(() => {
  LOG.info(`Finished Test: ${expect.getState().currentTestName}`)
})
