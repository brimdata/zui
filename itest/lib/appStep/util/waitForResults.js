/* @flow */

import {Application} from "spectron"

import logStep from "./logStep"
import {selectors} from "../../../../src/js/test/integration"

export default async (app: Application) => {
  await logStep("wait for results viewer to appear", () =>
    app.client.waitForVisible(selectors.viewer.results_base)
  )
}
