import {getAllStates} from "../../test/helpers/getTestState"

export default function addAuthDefaultsToWorkspaces(state: any) {
  for (const s of getAllStates(state)) {
    Object.values(s.workspaces).forEach((ws) => {
      // @ts-ignore
      if (!ws.authType) ws.authType = "none"
    })
  }

  return state
}
