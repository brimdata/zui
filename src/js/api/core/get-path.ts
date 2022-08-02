import * as remote from "@electron/remote"
import path from "path"

export type PathName = "app-data" | "zdeps" | "temp"

export function getPath(name: PathName) {
  switch (name) {
    case "app-data":
      return path.join(remote.app.getPath("userData"), "data")
    case "zdeps":
      return path.join(
        remote.app.getAppPath().replace("app.asar", "app.asar.unpacked"),
        "zdeps"
      )
    case "temp":
      return remote.app.getPath("temp")
    default:
      throw new Error("Unknown argument in getPath(name): " + name)
  }
}
