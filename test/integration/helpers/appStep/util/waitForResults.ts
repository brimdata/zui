import {Application} from "spectron"

import logStep from "./logStep"
import {selectors} from "../../integration"

export default (app: Application) =>
  logStep("wait for results viewer to appear", async () =>
    (await app.client.$(selectors.viewer.results_base)).waitForDisplayed()
  )
