import {app as electronApp} from "electron"

const isPackaged = () =>
  electronApp.isPackaged || process.env.NODE_ENV === "production"

export default {
  get isCI() {
    return process.env.GITHUB_ACTIONS === "true"
  },
  get isIntegrationTest() {
    // Delete this old thing
    return process.env.BRIM_ITEST === "true"
  },
  get isTest() {
    return process.env.NODE_ENV === "test"
  },
  get isDevelopment() {
    const isEnvSet = "ELECTRON_IS_DEV" in process.env
    const getFromEnv = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1
    return isEnvSet ? getFromEnv : !isPackaged()
  },
  get isRelease() {
    return isPackaged()
  },
  get isMac() {
    return process.platform === "darwin"
  },
  get isWindows() {
    return process.platform === "win32"
  },
  get isLinux() {
    return process.platform === "linux"
  },
}
