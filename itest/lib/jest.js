/* @flow */

import {Application} from "spectron"

import {selectors} from "../../src/js/test/integration"

export const TestTimeout = 60000

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
  done.fail && done.fail(realError)
}
