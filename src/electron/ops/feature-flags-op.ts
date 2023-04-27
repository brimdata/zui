import {app} from "electron"
import {createOperation} from "../../core/operations"

export const featureFlagsOp = createOperation("featureFlags", () => {
  return app.commandLine.getSwitchValue("feature-flags").split(",")
})
