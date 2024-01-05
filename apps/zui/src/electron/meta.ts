import {app} from "electron"
import {isFirstRun} from "./first-run"
import pkg from "./pkg"
import os from "os"

export async function getAppMeta() {
  return {
    repo: new URL(pkg.repository).pathname.slice(1),
    repository: pkg.repository,
    version: app.getVersion(),
    isFirstRun: await isFirstRun(),
    userName: os.userInfo().username,
    name: pkg.name,
  }
}

export type AppMeta = Awaited<ReturnType<typeof getAppMeta>>
