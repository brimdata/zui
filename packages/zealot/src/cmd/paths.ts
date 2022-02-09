import path from "path"
import os from "os"

export function getPath(name: string) {
  if (os.platform() === "win32") name += ".exe"

  return path.join(__dirname, "../../../../node_modules/zed/dist", name)
}
