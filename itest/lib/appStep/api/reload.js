/* @flow */
import {Application} from "spectron"

import logStep from "../util/logStep"

export default (app: Application) =>
  logStep("app reload", () => app.browserWindow.reload())
