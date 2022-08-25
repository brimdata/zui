import {app} from "electron"
import {createOperation} from "../operations"

export const featureFlagsOp = createOperation("featureFlags", () => {
  return app.commandLine.getSwitchValue("feature-flags").split(",")
})
