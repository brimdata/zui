import env from "src/app/core/env"
import {getPath} from "src/js/api/core/get-path"
import open from "src/js/lib/open"

export class EnvApi {
  // We need to package brimcap better
  get zdepsPath() {
    return getPath("zdeps")
  }

  get isWindows() {
    return env.isWindows
  }

  get isMac() {
    return env.isMac
  }

  get isLinux() {
    return env.isLinux
  }

  openExternal(uri: string, opts: {newWindow?: boolean} = {}) {
    return open(uri, opts)
  }
}
