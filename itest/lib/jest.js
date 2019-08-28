/* @flow */

import {Application} from "spectron"

import {selectors} from "../../src/js/test/integration"

export const TestTimeout = 300000
// https://jestjs.io/docs/en/troubleshooting#unresolved-promises
// https://jestjs.io/docs/en/jest-object#jestsettimeouttimeout
jest.setTimeout(TestTimeout)

// This is trying to make Flow happy for passing in the done function from
// Jest.
export type Done = {
  (string | Error | void): void,
  fail?: (string | Error | void) => void
}

export const handleError = async (
  app: Application,
  initialError: Error,
  done: Done
) => {
  let realError = undefined
  let notificationError = undefined
  console.log(`handleError: Test hit exception: ${initialError.message}`)
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
  done.fail && done.fail(realError.message)
}

// PROD-692: Put tests in a wrapper that prints what test is being run. This is
// to eagerly print to the console where the run is so that hangs and other
// failures are easier to diagnose. Without this, Jest is pretty silent and
// it's hard to know what went wrong in a CI run. This MUST be paired with jest
// --verbose to work properly, otherwise console.log() calls seem to get
// buffered and printed later.
export const stdTest = (
  descr: string,
  f: (done: Done) => void,
  timeout: number = TestTimeout
) => {
  test(
    descr,
    (done) => {
      console.log(`Running test: ${descr}`)
      f(done)
    },
    timeout
  )
}
