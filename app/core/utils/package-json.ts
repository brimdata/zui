import {readFileSync} from "fs-extra"
import {join} from "path"

const path = join(__dirname, "../../../package.json")
const file = readFileSync(path, {encoding: "utf-8"})
const json = JSON.parse(file)

export default json
