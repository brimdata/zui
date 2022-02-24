import {parseJSONLib} from "src/js/state/Queries/parsers"
import path from "path"
import BrimApi from "src/js/api"

export const activate = (api: BrimApi) => {
  // if lib already exists, do not re-import
  if (api.queries.getGroup("brim")) return

  const brimLib = parseJSONLib(
    path.join(__dirname, "static", "brim-queries.json")
  )
  // give lib root a custom, fixed id so app can prevent it from being modified
  brimLib.id = "brim"
  brimLib.isOpen = true

  // updates lib every window startup
  api.queries.add(brimLib)
}

export function deactivate() {}
