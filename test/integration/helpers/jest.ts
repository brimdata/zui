import {Application} from "spectron"

import appStep from "./appStep/api"
import {selectors} from "./integration"
import {LOG} from "./log"

export const handleError = async (
  app: Application,
  initialError: Error,
  done: any
) => {
  appStep.takeScreenshot(app)
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
