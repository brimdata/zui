/* @flow */
import {Application} from "spectron"

import logStep from "../util/logStep"

export default async (app: Application) => {
  await logStep("app reload", () => app.browserWindow.reload())
}
