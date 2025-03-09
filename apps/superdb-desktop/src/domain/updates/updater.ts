import env from "src/core/env"
import {LinuxUpdater} from "./linux-updater"
import {MacWinUpdater} from "./mac-win-updater"

export const updater = env.isLinux ? new LinuxUpdater() : new MacWinUpdater()
