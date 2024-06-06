import {autoUpdater} from "electron-updater"
import {Updater} from "./types"
import semver from "semver"
import {app, shell} from "electron"
import env from "src/app/core/env"
import links from "src/app/core/links"
import pkg from "src/electron/pkg"

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = false
autoUpdater.forceDevUpdateConfig = true

export class LinuxUpdater implements Updater {
  async check() {
    const {updateInfo} = await autoUpdater.checkForUpdates()
    const latest = updateInfo.version
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

  private downloadUrl() {
    if (env.isInsiders) {
      return pkg.repository + "/releases/latest"
    } else {
      return links.ZUI_DOWNLOAD
    }
  }
}
