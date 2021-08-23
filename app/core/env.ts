import {app as electronApp, remote} from "electron"
const app = electronApp || (remote && remote.app)

export default {
  get isCI() {
    return process.env.GITHUB_ACTIONS === "true"
  },
  get isIntegrationTest() {
    return process.env.BRIM_ITEST === "true"
  },
  get isTest() {
    return process.env.NODE_ENV === "test"
  },
  get isDevelopment() {
    const isEnvSet = "ELECTRON_IS_DEV" in process.env
    const getFromEnv = parseInt(process.env.ELECTRON_IS_DEV || "", 10) === 1
    return isEnvSet ? getFromEnv : app && !app.isPackaged
  },
  get isRelease() {
    return app.isPackaged
  },
  get isMac() {
    return process.platform === "darwin"
  },
  get isWindows() {
    return process.platform === "win32"
  },
  get isLinux() {
    return process.platform === "linux"
  }
}
