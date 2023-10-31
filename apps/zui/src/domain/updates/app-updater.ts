import {autoUpdater} from "electron-updater"
import Updates from "src/js/state/Updates"
import {Store} from "src/js/state/types"

autoUpdater.autoDownload = false

class AppUpdater {
  initialize(store: Store) {
    const dispatch = store.dispatch

    autoUpdater.on("update-available", (response) => {
      dispatch(Updates.setIsChecking(false))
      dispatch(Updates.setNextVersion(response.version))
    })
    autoUpdater.on("update-not-available", () => {
      dispatch(Updates.setIsChecking(false))
      dispatch(Updates.setNextVersion(null))
    })
    autoUpdater.on("checking-for-update", (response) => {
      console.log("checking", response)
      dispatch(Updates.setIsChecking(true))
    })
    autoUpdater.on("download-progress", (response) => {
      console.log("progress", response)
      dispatch(Updates.setDownloadProgress(0.5))
    })
    autoUpdater.on("error", (error) => {
      console.log("error", error)
      dispatch(Updates.setError(error))
    })
    autoUpdater.on("update-downloaded", (response) => {
      console.log("downloaded", response)
    })
  }

  check() {
    autoUpdater.checkForUpdates()
  }

  download() {
    autoUpdater.downloadUpdate()
  }
}

export const appUpdater = new AppUpdater()
