import {join} from "path"
import {readJSONSync} from "fs-extra"

export function getPackageJSON() {
  return readJSONSync(join(__dirname, "../package.json"))
}
