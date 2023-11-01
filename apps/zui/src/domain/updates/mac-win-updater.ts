import {autoUpdater} from "electron-updater"
import {Updater} from "./types"
import semver from "semver"
import {app} from "electron"

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = false

export class MacWinUpdater implements Updater {
  async check() {
    const {updateInfo} = await autoUpdater.checkForUpdates()
    const latest = updateInfo.version
    const current = app.getVersion()
    if (semver.lte(current, latest)) {
      return latest
    } else {
      return null
    }
  }

  async install(onProgress) {
    const progress = (r) => {
      onProgress(r.percent / 100)
    }
    autoUpdater.on("error", (e) => {
      throw e
    })
    autoUpdater.on("download-progress", progress)

    return new Promise((resolve, reject) => {
      autoUpdater.on("update-downloaded", resolve)
      autoUpdater.on("error", reject)
      autoUpdater.downloadUpdate()
    }).then(() => {
      autoUpdater.quitAndInstall()
    })
  }
}
