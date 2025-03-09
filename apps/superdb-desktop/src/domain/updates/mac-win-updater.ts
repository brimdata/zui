import {autoUpdater} from "electron-updater"
import {Updater} from "./types"
import semver from "semver"
import {app} from "electron"
import {getMainObject} from "src/core/main"

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = false
autoUpdater.forceDevUpdateConfig = true

export class MacWinUpdater implements Updater {
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
      // `autoUpdater.quitAndInstall()` will close all application windows first and only emit `before-quit` event on `app` after that.
      // We have some logic when closing windows that checks to see if we are quitting or not.
      // So we call onBeforeQuit manually here to tell the main object we are quitting
      getMainObject().onBeforeQuit()
      autoUpdater.quitAndInstall()
    })
  }
}
