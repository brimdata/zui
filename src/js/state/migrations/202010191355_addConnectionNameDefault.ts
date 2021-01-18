import {getAllStates} from "../../test/helpers/getTestState"
import {Workspace} from "../Workspaces/types"

export default function addConnectionNameDefault(state: any) {
  // backfill connection names with id
  for (const s of getAllStates(state)) {
    if (!s.clusters) continue
    Object.values(s.clusters).forEach((c: Workspace) => {
      c.name = c.id
    })
  }

  return state
}
