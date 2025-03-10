import {getAllStates} from "./utils/getTestState"

export default function removeDraftQueries(state: any) {
  for (const s of getAllStates(state)) {
    delete s.draftQueries
  }

  return state
}
