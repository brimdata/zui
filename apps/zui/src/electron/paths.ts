import {app} from "electron"
import {join} from "path"

class Paths {
  root() {
    return app.getAppPath()
  }

  packageJSON() {
    return join(this.root(), "package.json")
  }
}

export const paths = new Paths()
