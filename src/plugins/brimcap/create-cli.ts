import {ZuiMain} from "src/js/electron/zui-main"
import BrimcapCLI from "./brimcap-cli"
import env from "src/app/core/env"
import path from "path"

export function createCli(main: ZuiMain) {
  const zdepsDirectory = main.getPath("zdeps")
  const commandName = env.isWindows ? "brimcap.exe" : "brimcap"
  const bin = path.join(zdepsDirectory, commandName)
  return new BrimcapCLI(bin)
}
