import {autoUpdater} from "electron-updater"
import Updates from "src/js/state/Updates"
import {Store} from "src/js/state/types"

class AppUpdater {
  static interval = 1000 * 60 * 60 * 24 // 1 day
  private unlisten = () => {}

  initialize(
    store: Store,
    mode: "disabled" | "manual" | "startup" | "default"
  ) {
    this.cleanup()
    this.unlisten = this.listen(store.dispatch)

    switch (mode) {
      case "disabled":
        autoUpdater.autoDownload = false
        autoUpdater.autoInstallOnAppQuit = false
        break
      case "manual":
        autoUpdater.autoDownload = false
        autoUpdater.autoInstallOnAppQuit = false
        break
      case "startup":
        autoUpdater.autoDownload = true
        autoUpdater.autoInstallOnAppQuit = true
        this.check()
        break
      default:
        autoUpdater.autoDownload = true
        autoUpdater.autoInstallOnAppQuit = true
        this.check()
        this.scheduleCheck()
    }
  }

  listen(dispatch) {
    const onAvailable = (response) => {
      dispatch(Updates.setIsChecking(false))
      dispatch(Updates.setNextVersion(response.version))
    }
    const onNotAvailable = () => {
      dispatch(Updates.setIsChecking(false))
      dispatch(Updates.setNextVersion(null))
    }
    const onChecking = () => {
      dispatch(Updates.setIsChecking(true))
    }
    const onDownloadProgress = (response) => {
      console.log("progress", response)
      dispatch(Updates.setDownloadProgress(0.5))
    }
    const onError = (error) => {
      dispatch(Updates.setError(error))
    }

    autoUpdater
      .on("update-available", onAvailable)
      .on("update-not-available", onNotAvailable)
      .on("checking-for-update", onChecking)
      .on("download-progress", onDownloadProgress)
      .on("error", onError)

    return () => {
      autoUpdater
        .off("update-available", onAvailable)
        .off("update-not-available", onNotAvailable)
        .off("checking-for-update", onChecking)
        .off("download-progress", onDownloadProgress)
        .off("error", onError)
    }
  }

  check() {
    autoUpdater.checkForUpdates()
  }

  download() {
    return new Promise((resolve, reject) => {
      autoUpdater.on("update-downloaded", resolve).on("error", reject)
      autoUpdater.downloadUpdate()
    })
  }

  install() {
    autoUpdater.quitAndInstall()
  }

  private cleanup() {
    this.unlisten()
    this.cancelSchedule()
  }

  private scheduleId: any
  private scheduleCheck() {
    this.scheduleId = setTimeout(() => {
      this.check()
      this.scheduleCheck()
    }, AppUpdater.interval)
  }
  private cancelSchedule() {
    clearTimeout(this.scheduleId)
  }
}

export const appUpdater = new AppUpdater()
