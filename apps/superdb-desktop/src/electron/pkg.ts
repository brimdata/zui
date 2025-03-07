import {readJSONSync} from "fs-extra"
import {paths} from "./paths"

const pkg = readJSONSync(paths.packageJSON())

export default pkg
