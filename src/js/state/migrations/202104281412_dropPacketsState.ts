import {getAllStates} from "../../test/helpers/getTestState"

export default function dropPacketsState(state: any) {
  for (const s of getAllStates(state)) {
    delete s.packets
  }
  return state
}
