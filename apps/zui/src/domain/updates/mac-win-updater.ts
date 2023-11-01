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

    let resolve
    let reject

    return new Promise((res, rej) => {
      resolve = res
      reject = rej
      autoUpdater.on("update-downloaded", resolve)
      autoUpdater.on("download-progress", progress)
      autoUpdater.on("error", reject)
      autoUpdater.downloadUpdate()
    })
      .finally(() => {
        autoUpdater.off("download-progress", onProgress)
        autoUpdater.off("update-downloaded", resolve)
        autoUpdater.off("error", reject)
      })
      .then(() => {
        autoUpdater.quitAndInstall()
      })
  }
}
