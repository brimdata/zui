import {app} from "electron"
import os from "os"
import {join} from "path"
import {createClient} from "src/pkg/electron-ipc-service"

const exe = (name) => (os.platform() === "win32" ? `${name}.exe` : name)

class Paths {
  brimcap() {
    return join(
      app.getAppPath().replace("app.asar", "app.asar.unpacked"),
      "zdeps",
      exe("brimcap")
    )
  }
}

export const paths = new Paths()
export const pathsClient = createClient(Paths)
