import {app} from "electron"
import os from "os"
import {join} from "path"

if ("jest" in globalThis) {
  app.getPath = jest.fn((name) => {
    if (name === "temp") return os.tmpdir()
    return join(__dirname, "../../../../run/unit/data")
  })

  app.getAppPath = jest.fn(() => {
    return join(__dirname, "../../../../")
  })
}
