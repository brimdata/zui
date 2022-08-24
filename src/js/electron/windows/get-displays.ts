import {screen} from "electron"

export function getDisplays() {
  return screen.getAllDisplays().map((s) => s.workArea)
}
