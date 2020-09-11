import fsExtra from "fs-extra"
import path from "path"

export function response(name: string) {
  const string = fsExtra.readFileSync(path.join(__dirname, name), "utf-8")
  return string.split("\n\n\n").map((json) => JSON.parse(json))
}
