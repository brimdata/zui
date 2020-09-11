import {app, autoUpdater, dialog} from "electron"
import log from "electron-log"
import get from "lodash/get"
import semver from "semver"
import got from "got"
import open from "../lib/open"

const getFeedURLForPlatform = (platform) => {
  return `https://update.electronjs.org/brimsec/brim/${platform}/${app.getVersion()}`
}

const autoUpdateLinux = async () => {
  // Check for updates for MacOS and if there are then we assume there is also one for linux
  const url = getFeedURLForPlatform("darwin-x64")
  try {
    const currentVersion = app.getVersion()
    if (!semver.valid(currentVersion))
      throw "Invalid current version format: " + currentVersion

    const resp = await got(url).json()

    const latestVersion = get(resp, "name", "")
    if (!semver.valid(latestVersion))
      throw "Invalid latest version format: " + latestVersion

    if (semver.gte(currentVersion, latestVersion)) {
      // up to date
      return
    }

    const dialogOpts = {
      type: "info",
      buttons: ["Get Update", "Later"],
      title: "Application Update",
      message: "A new version of Brim is available.",
      detail: `Brim version ${latestVersion} is available for download; you are running v${currentVersion}.`
    }

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      const navUrl = "https://www.brimsecurity.com/download/"
      if (returnValue.response === 0) open(navUrl)
    })
  } catch (err) {
    throw "Error checking for linux updates: " + err
  }
}

export function setupAutoUpdater() {
  if (process.platform === "linux") {
    autoUpdateLinux().catch((err) => log.error(err))
    return
  }

  const feedURL = getFeedURLForPlatform(process.platform)

  // @ts-ignore
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
