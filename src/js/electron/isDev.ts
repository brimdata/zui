import {app as electronApp} from "electron"

const app = electronApp || require("@electron/remote")?.app

const isEnvSet = "ELECTRON_IS_DEV" in process.env
const getFromEnv = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1

export default isEnvSet ? getFromEnv : app && !app.isPackaged
