import {getAllStates} from "./utils/getTestState"

export default function resetInvestigationsAndTabHistories(state: any) {
  for (const s of getAllStates(state)) {
    delete s.tabHistories
    delete s.investigation
  }

  return state
}
