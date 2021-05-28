import {readFileSync} from "fs"
import path from "path"

export default function responses(name: string) {
  const string = readFileSync(path.join(__dirname, name), "utf-8")
  return string.split("\n\n\n").map((json) => JSON.parse(json))
}
