import BrimApi from "../../src/js/api"
import {parseJSONLib} from "../../src/js/state/Queries/parsers"
import path from "path"

export const activate = (api: BrimApi) => {
  const brimLib = parseJSONLib(
    path.join(__dirname, "static", "brim-queries.json")
  )
  // give lib root a custom, fixed id so app can prevent it from being modified
  brimLib.id = "brim"
  const existingLib = api.queries.get("brim")

  // preserve open state if set, else default to open
  if (existingLib) brimLib.isOpen = !!existingLib.isOpen
  else brimLib.isOpen = true

  // updates lib every window startup
  api.queries.add(brimLib)
}

export function deactivate() {}
