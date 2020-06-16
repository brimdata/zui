/* @flow */

import {Application} from "spectron"

import {retryUntil} from "../../control"
import {waitForClickableButtonAndClick} from "./click"
import logStep from "../util/logStep"
import {selectors} from "../../../../src/js/test/integration"

export default async (app: Application) => {
  await waitForClickableButtonAndClick(app, selectors.pcaps.button)
  return await logStep("wait for a download to finish", async () => {
    await app.client.waitForVisible(selectors.downloadMessage)
    return await retryUntil(
      () => app.client.getText(selectors.downloadMessage),
      (text) => text == "Download Complete" || text.includes("Download error")
    )
  })
}

export const pcapsDir = async (app: Application) =>
  await app.electron.remote.app.getPath("temp")
