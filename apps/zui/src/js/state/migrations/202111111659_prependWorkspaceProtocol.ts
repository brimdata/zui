import {getAllStates} from "./utils/getTestState"

export default function prependWorkspaceProtocol(state: any) {
  for (const s of getAllStates(state)) {
    if (!s.workspaces) continue
    Object.values(s.workspaces).forEach((workspace) => {
      // @ts-ignore
      workspace.host = `http://${workspace.host}`
    })
  }

  return state
}
