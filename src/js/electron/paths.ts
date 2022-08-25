import {app} from "electron"
import os from "os"
import {join} from "path"

const exe = (name) => (os.platform() === "win32" ? `${name}.exe` : name)

class Paths {
  brimcap() {
    return join(
      app.getAppPath().replace("app.asar", "app.asar.unpacked"),
      "zdeps",
      exe("brimcap")
    )
  }

  root() {
    return app.getAppPath()
  }

  packageJSON() {
    return join(this.root(), "package.json")
  }
}

export const paths = new Paths()
