import {app} from "electron"
import {execSync} from "child_process"
import {join} from "path"
import fs from "fs-extra"

import env from "src/app/core/env"
import {createOperation} from "src/core/operations"

export const properties = createOperation("env.properties", () => {
  return env
})

export const about = createOperation("env.aboutApp", () => {
  const root = app.getAppPath().replace("app.asar", "app.asar.unpacked")
  const packageJSON = fs.readJSONSync(join(root, "package.json"))
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
