import {app} from "electron"
import {isFirstRun} from "./first-run"
import pkg from "./pkg"

export async function getAppMeta() {
  return {
    repo: new URL(pkg.repository).pathname.slice(1),
    version: app.getVersion(),
    isFirstRun: await isFirstRun(),
  }
}

export type AppMeta = Awaited<ReturnType<typeof getAppMeta>>
