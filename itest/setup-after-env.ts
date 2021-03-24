import {LOG} from "./lib/log"

beforeEach(() => {
  LOG.info(`Starting Test: ${expect.getState().currentTestName}`)
})

afterEach(() => {
  LOG.info(`Finished Test: ${expect.getState().currentTestName}`)
})
