import {app} from "electron"
import {execSync} from "child_process"
import {join} from "path"
import env from "src/core/env"
import {createOperation} from "src/core/operations"
import {getPackageJSON} from "./packageJSON"

export const properties = createOperation(
  "env.properties",
  ({main}, windowId: string) => {
    return {
      ...env,
      isHiddenWindow: main.windows.isHidden(windowId),
    }
  }
)

export const aboutApp = createOperation("env.aboutApp", () => {
  const root = app.getAppPath().replace("app.asar", "app.asar.unpacked")
  const packageJSON = getPackageJSON()
  return {
    version: getVersion(packageJSON),
    acknowledgementsPath: join(root, "acknowledgments.txt"),
    licensePath: join(root, "LICENSE.txt"),
    website: "https://brimdata.io",
    repository: packageJSON.repository,
  }
})

function getVersion(packageJson: {version: string}) {
  return env.isDevelopment
    ? execSync("git describe --tags --dirty").toString()
    : packageJson.version
}
