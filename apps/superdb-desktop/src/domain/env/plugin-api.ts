import env from "src/core/env"
import {getPath} from "src/js/api/core/get-path"
import {join} from "path"

export class EnvApi {
  get isWindows() {
    return env.isWindows
  }

  get isMac() {
    return env.isMac
  }

  get isLinux() {
    return env.isLinux
  }

  get isTest() {
    return env.isTest
  }

  getExePath(relPath: string) {
    return join(getPath("zdeps"), relPath) + (env.isWindows ? ".exe" : "")
  }
}
