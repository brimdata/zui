import {getAllStates} from "../../test/helpers/getTestState"

export default function dropSpaces(state: any) {
  // Default search records to "events"
  for (const s of getAllStates(state)) {
    delete s.spaces
  }
  return state
}
