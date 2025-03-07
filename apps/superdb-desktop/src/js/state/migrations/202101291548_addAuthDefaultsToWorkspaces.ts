import {getAllStates} from "src/js/state/migrations/utils/getTestState"

export default function addAuthDefaultsToWorkspaces(state: any) {
  for (const s of getAllStates(state)) {
    if (!s.workspaces) continue
    Object.values(s.workspaces).forEach((ws) => {
      // @ts-ignore
      if (!ws.authType) ws.authType = "none"
    })
  }

  return state
}
