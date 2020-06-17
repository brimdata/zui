/* @flow */

import {Application} from "spectron"

import logStep from "../util//logStep"
import {selectors} from "../../../../src/js/test/integration"

export const waitForNewTab = (app: Application) => {
  return logStep("wait for new tab to appear", () =>
    app.client.waitForVisible(selectors.ingest.filesButton)
  )
}

export default async (app: Application) => {
  await logStep("starting app", () => app.start())
  await waitForNewTab(app)
}
