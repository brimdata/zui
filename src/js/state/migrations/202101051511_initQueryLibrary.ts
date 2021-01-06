import {getAllStates} from "src/js/test/helpers/getTestState"

export default function initQueryLibrary(state: any) {
  // Migrate state here
  for (const s of getAllStates(state)) {
    delete s.queries
  }
  return state
}
