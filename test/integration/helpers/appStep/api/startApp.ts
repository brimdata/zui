import {Application} from "spectron"

import logStep from "../util/logStep"
import {selectors} from "../../integration"

export const waitForNewTab = (app: Application) => {
  return logStep("wait for new tab to appear", async () => {
    await app.client.windowByIndex(0)
    return (await app.client.$(selectors.ingest.filesButton)).waitForDisplayed()
  })
}

export default async (app: Application) => {
  await logStep("starting app", () => app.start())
  return waitForNewTab(app)
}
