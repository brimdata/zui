/* @flow */

import {Application} from "spectron"

import {takeScreenshot} from "./app"
import {selectors} from "../../src/js/test/integration"
import {LOG} from "./log"

export const TestTimeout = 300000
// https://jestjs.io/docs/en/troubleshooting#unresolved-promises
// https://jestjs.io/docs/en/jest-object#jestsettimeouttimeout
jest.setTimeout(TestTimeout)

export const handleError = async (
  app: Application,
  initialError: Error,
  done: *
) => {
  takeScreenshot(app)
  let realError = undefined
  let notificationError = undefined
  LOG.error(`handleError: Test hit exception: ${initialError.message}`)
  LOG.info("handleError: Looking for any desktop app notifications")
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
    LOG.info("handleError: desktop app notification not found")
    realError = initialError
  }
  done.fail && done.fail(realError)
}

// Put tests in a wrapper that prints what test is being run. This is
// to eagerly print to the console where the run is so that hangs and other
// failures are easier to diagnose. Without this, Jest is pretty silent and
// it's hard to know what went wrong in a CI run. This MUST be paired with jest
// --verbose to work properly, otherwise LOG.info() calls seem to get
// buffered and printed later.
export const stdTest = (
  descr: string,
  f: (done: *) => void | Promise<void>,
  timeout: number = TestTimeout
) => {
  test(
    descr,
    (done) => {
      LOG.info(`Running test: ${descr}`)
      f(done)
    },
    timeout
  )
}
