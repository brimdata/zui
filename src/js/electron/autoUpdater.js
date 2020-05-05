/* @flow */
import {app, autoUpdater, dialog} from "electron"
import log from "electron-log"

export function setupAutoUpdater() {
  const feedURL = URL.resolve(
    "https://update.electronjs.org/brimsec/brim",
    process.platform,
    app.getVersion()
  )
  autoUpdater.setFeedURL(feedURL)

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

  // check for updates 30s after startup
  setTimeout(() => {
    autoUpdater.checkForUpdates()
  }, 30 * 1000)

  // then check for updates once a day
  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 24 * 60 * 60 * 1000)
}
