import {readJSONSync} from "fs-extra"
import {createClient} from "src/pkg/electron-ipc-service"
import {app} from "test/unit/__mocks__/electron"
import {paths} from "./paths"

class Meta {
  _packageJSON: object | undefined

  repo() {
    const {repository} = this.packageJSON()
    return new URL(repository).pathname.slice(1)
  }

  packageJSON() {
    return this._packageJSON
      ? this._packageJSON
      : (this._packageJSON = readJSONSync(paths.packageJSON()))
  }

  version() {
    return app.getVersion()
  }
}

export const meta = new Meta()
export const metaClient = createClient(Meta)
