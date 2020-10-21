import {getAllStates} from "../../test/helpers/getTestState"
import {Cluster} from "../Clusters/types"

export default function addConnectionNameDefault(state: any) {
  // backfill connection names with id
  for (const s of getAllStates(state)) {
    if (!s.clusters) continue
    Object.values(s.clusters).forEach((c: Cluster) => {
      c.name = c.id
    })
  }

  return state
}
