import {getAllRendererStates, getAllTabs} from "./utils/getTestState"

export default function populateSessions(state: any) {
  for (let win of getAllRendererStates(state)) {
    console.log(win.query_sessions)
  }

  for (const tab of getAllTabs(state)) {
    // console.log(tab)
  }
  return state
}
