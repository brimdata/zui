import path from "path"
import os from "os"

export function getPath(name: string) {
  if (os.platform() === "win32") name += ".exe"
  let dir = "../../../../node_modules/zed/dist"
  if (isBuilt()) dir = "../" + dir
  return path.join(__dirname, dir, name)
}

function isBuilt() {
  const buildDir = path.normalize("dist/cjs/cmd")
  const regex = new RegExp(`${buildDir}$`)
  return regex.test(__dirname)
}
