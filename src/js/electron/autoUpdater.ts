import {dialog} from "electron"
import log from "electron-log"
import {autoUpdater} from "electron-updater"

export async function setupAutoUpdater() {
  autoUpdater.on("update-downloaded", (event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: "info",
      buttons: ["Restart", "Later"],
      title: "Application Update",
      // releaseNotes are not available for windows, so use name instead
      message: process.platform === "win32" ? releaseNotes : releaseName,
      detail:
        "A new version of Brim has been downloaded. Restart the application to apply the update."
    }

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
  })

  autoUpdater.on("error", (err) => {
    log.error("There was a problem updating the application: " + err)
  })

  setUpdateRepeater(() => {
    autoUpdater.checkForUpdates()
  })
}

const setUpdateRepeater = (updateCb) => {
  // check for updates 30s after startup
  setTimeout(updateCb, 30 * 1000)
  // then check for updates once a day
  setInterval(updateCb, 24 * 60 * 60 * 1000)
}
