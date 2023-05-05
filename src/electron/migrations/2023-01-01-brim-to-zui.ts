import {app} from "electron"
import path from "path"
import fs from "fs-extra"
import log from "electron-log"
import {isFirstRun, setFirstRun} from "../first-run"
import env from "src/app/core/env"

// On first ever run of a ZUI release, check if there is existing Brim app
// data and if so, copy it into ZUI.

export default async () => {
  if (env.isDevelopment) return
  if (!(await isFirstRun())) return
  if (app.name !== "Zui") return

  const zuiPath = app.getPath("userData")
  const zuiAppStatePath = path.join(zuiPath, "appState.json")
  const zuiAppDataPath = path.join(zuiPath, "data")

  const brimPath = zuiPath.replace("Zui", "Brim")
  if (zuiPath === brimPath) return

  const brimAppStatePath = path.join(brimPath, "appState.json")
  const brimAppDataPath = path.join(brimPath, "data")

  try {
    fs.statSync(brimAppStatePath)
    fs.statSync(brimAppDataPath)
    log.info("brim data found")
  } catch {
    log.info("no brim data to migrate")
    return
  }

  try {
    fs.statSync(zuiAppStatePath)
    fs.statSync(zuiAppDataPath)
    log.info("zui data already exists, aborting migration")
    return
  } catch {
    log.info("no existing zui data, proceeding to migrate")
  }

  try {
    log.info(`migrating '${brimAppStatePath}' => '${zuiAppStatePath}'`)
    fs.copySync(brimAppStatePath, zuiAppStatePath)
    log.info(`migrating '${brimAppDataPath} => ${zuiAppDataPath}'`)
    fs.copySync(brimAppDataPath, zuiAppDataPath)
  } catch (err) {
    log.error("migration failed: ", err)
    return
  }

  log.info(`marking that the app has been previously run`)
  setFirstRun(false)

  log.info("migration completed")
}
