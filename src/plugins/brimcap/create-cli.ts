import {env} from "src/zui"
import BrimcapCLI from "./brimcap-cli"
import path from "path"

export function createCli() {
  const commandName = env.isWindows ? "brimcap.exe" : "brimcap"
  const bin = path.join(env.zdepsPath, commandName)
  return new BrimcapCLI(bin)
}
