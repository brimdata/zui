import {getAllStates} from "./utils/getTestState"

export default function prependWorkspaceProtocol(state: any) {
  /*
  for (const s of getAllStates(state)) {
    if (!s.workspaces) continue
    // const newWorkspaces = {}
    Object.entries(s.workspaces).forEach(([keyId, workspace]) => {
      // @ts-ignore
      workspace.host = `http://${host}`
      // @ts-ignore
      if (keyId === "localhost:9867") {
        // @ts-ignore
        workspaces["http://localhost:9867"] = {
          // @ts-ignore
          ...workspace,
          host: "http://localhost"
        }
        delete workspace[keyId]
      }
    })

    // s.workspaces = newWorkspaces
  }
  
   */

  // Migrate state here
  return state
}
