import {pathsClient} from "app/ipc/paths"
import {readJSON} from "fs-extra"
import {join} from "path"

let cache

export default async function packageJSON() {
  if (cache) return cache
  const root = await pathsClient.root()
  const filePath = join(root, "package.json")
  return (cache = readJSON(filePath))
}
