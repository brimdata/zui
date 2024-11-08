import {AppState} from "./app-state"
import states from "src/test/unit/states"

test("#initialize", () => {
  const path = states.getPath("v1.17.0.json")
  const backupDir = __dirname
  new AppState({path, backupDir})
})
