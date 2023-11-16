import {app, shell} from "electron"
import fetch from "node-fetch"
import semver from "semver"
import env from "src/app/core/env"
import links from "src/app/core/links"
import pkg from "src/electron/pkg"
import {Updater} from "./types"
import {getMainObject} from "src/core/main"

export class LinuxUpdater implements Updater {
  async check() {
    const latest = await this.latest()
    const current = app.getVersion()
    if (semver.lt(current, latest)) {
      return latest
    } else {
      return null
    }
  }

  async install() {
    shell.openExternal(this.downloadUrl())
  }

  private async latest() {
    const resp = await fetch(this.latestUrl())
    if (resp.status === 204) return app.getVersion()
    const data = await resp.json()
    return data.name
  }

  private latestUrl() {
    const repo = getMainObject().appMeta.repo
    const platform = "darwin-x64" // If the mac version exists, the linux does too
    return `https://update.electronjs.org/${repo}/${platform}/${app.getVersion()}`
  }

  private downloadUrl() {
    if (env.isInsiders) {
      return pkg.repository + "/releases/latest"
    } else {
      return links.ZUI_DOWNLOAD
    }
  }
}
