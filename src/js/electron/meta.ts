import {app} from "electron"
import {isFirstRun} from "./first-run"
import pkg from "./pkg"

export function getAppMeta() {
  return {
    repo: new URL(pkg.repository).pathname.slice(1),
    version: app.getVersion(),
    isFirstRun: isFirstRun(),
  }
}

export type AppMeta = ReturnType<typeof getAppMeta>
