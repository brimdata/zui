import {app} from "electron"
import path from "path"

export type PathName = "app-data" | "zdeps" | "temp"

export function getPath(name: PathName) {
  switch (name) {
    case "app-data":
      return path.join(app.getPath("userData"), "data")
    case "zdeps":
      return path.join(
        app.getAppPath().replace("app.asar", "app.asar.unpacked"),
        "zdeps"
      )
    case "temp":
      return app.getPath("temp")
    default:
      throw new Error("Unknown argument in getPath(name): " + name)
  }
}
