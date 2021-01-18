import {getAllStates} from "../../test/helpers/getTestState"
import {Workspace} from "../Workspaces/types"

export default function removeClustersStatus(state: any) {
  for (const s of getAllStates(state)) {
    if (!s.clusters) continue
    Object.values(s.clusters).forEach((c: Workspace) => {
      // @ts-ignore
      delete c.status
    })
  }

  return state
}
