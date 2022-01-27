import {getAllStates} from "src/js/state/migrations/utils/getTestState"

export default function addAuthDefaultsToWorkspaces(state: any) {
  for (const s of getAllStates(state)) {
    if (!s.lakes) continue
    Object.values(s.lakes).forEach((l) => {
      // @ts-ignore
      if (!l.authType) l.authType = "none"
    })
  }

  return state
}
