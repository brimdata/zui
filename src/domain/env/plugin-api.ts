import env from "src/app/core/env"
import {getPath} from "src/js/api/core/get-path"
import open from "src/js/lib/open"
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

  openExternal(uri: string, opts: {newWindow?: boolean} = {}) {
    return open(uri, opts)
  }

  getExePath(relPath: string) {
    return join(getPath("zdeps"), relPath) + (env.isWindows ? ".exe" : "")
  }
}
