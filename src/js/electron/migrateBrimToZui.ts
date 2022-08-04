import {app} from "electron"
import path from "path"
import fs from "fs-extra"
import log from "electron-log"

export default () => {
  if (app.name !== "Zui") return
  const zuiPath = app.getPath("userData")
  const zuiAppStatePath = path.join(zuiPath, "appState.json")
  const zuiAppLakePath = path.join(zuiPath, "lake")
  const zuiAppDataPath = path.join(zuiPath, "data")

  const brimPath = zuiPath.replace("Zui", "Brim")
  if (zuiPath === brimPath) return

  const brimAppStatePath = path.join(brimPath, "appState.json")
  const brimAppLakePath = path.join(brimPath, "lake")
  const brimAppDataPath = path.join(brimPath, "data")

  try {
    fs.statSync(brimAppStatePath)
    fs.statSync(brimAppLakePath)
    fs.statSync(brimAppDataPath)
    log.info("brim data found")
  } catch {
    log.info("no brim data to migrate")
    return
  }

  try {
    fs.statSync(zuiAppStatePath)
    fs.statSync(zuiAppLakePath)
    fs.statSync(zuiAppDataPath)
    log.info("zui data already exists, aborting migration")
    return
  } catch {
    log.info("no existing zui data, proceeding to migrate")
  }

  try {
    log.info(`migrating '${brimAppStatePath}' => '${zuiAppStatePath}'`)
    fs.copySync(brimAppStatePath, zuiAppStatePath)
    log.info(`migrating '${brimAppLakePath} => ${zuiAppLakePath}'`)
    fs.copySync(brimAppLakePath, zuiAppLakePath)
    log.info(`migrating '${brimAppDataPath} => ${zuiAppDataPath}'`)
    fs.copySync(brimAppDataPath, zuiAppDataPath)
  } catch (err) {
    log.error("migration failed: ", err)
    return
  }

  log.info("migration completed")
}
