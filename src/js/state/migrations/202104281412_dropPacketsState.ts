import {getAllStates} from "src/js/state/migrations/utils/getTestState"

export default function dropPacketsState(state: any) {
  for (const s of getAllStates(state)) {
    delete s.packets
  }
  return state
}
