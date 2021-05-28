import {Application} from "spectron"

import {retryUntil} from "../../control"
import {waitForClickableButtonAndClick} from "./click"
import logStep from "../util/logStep"
import {selectors} from "../../../../../src/js/test/integration"
import {toastLocator} from "../../../../../src/js/test/locators"

export default async (app: Application) => {
  await waitForClickableButtonAndClick(app, selectors.pcaps.button)
  return logStep("wait for a download to finish", async () => {
    return retryUntil(
      async () => (await app.client.$(toastLocator.css)).getHTML(false),
      (s) => /preparation complete/i.test(s)
    )
  })
}

export const pcapsDir = (app: Application) =>
  app.electron.remote.app.getPath("temp")
