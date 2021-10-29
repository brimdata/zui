import {Application} from "spectron"
import {selectors} from "../../integration"
import logStep from "../util/logStep"

export const waitForNewTab = (app: Application) =>
  logStep("wait for new tab to appear", async () =>
    (await app.client.$(selectors.ingest.filesButton)).waitForDisplayed()
  )

export default async (app: Application) => {
  await logStep("starting app", () => app.start())
  await app.client.switchWindow("Brim")
  return waitForNewTab(app)
}
