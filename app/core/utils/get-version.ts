import {remote} from "electron"

export function getVersion() {
  return remote.app.getVersion()
}
