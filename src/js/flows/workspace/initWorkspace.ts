import Current from "../../state/Current"
import Workspaces from "../../state/Workspaces"
import {globalDispatch} from "../../state/GlobalContext"
import {Workspace} from "../../state/Workspaces/types"
import WorkspaceStatuses from "../../state/WorkspaceStatuses"
import {WorkspaceStatus} from "../../state/WorkspaceStatuses/types"
import refreshSpaceNames from "../refreshSpaceNames"

export const initWorkspace = (ws: Workspace, status: WorkspaceStatus) => (
  dispatch
): void => {
  dispatch(Workspaces.add(ws))
  dispatch(WorkspaceStatuses.set(ws.id, status))
  globalDispatch(Workspaces.add(ws)).then(() => {
    dispatch(Current.setWorkspaceId(ws.id))
    dispatch(refreshSpaceNames())
  })
}

//
// // no auth required
// if (workspace.authType === "none") {
//   setupWorkspace(dispatch, workspace, "connected")
//   return null
// }
//
// // if auth is required, and method is auth0...
// if (workspace.authType === "auth0") {
//   // ...and we have logged in before
//   if (workspace.authData.accessToken) {
//     setupWorkspace(dispatch, workspace, "connected")
//     return null
//   }
//
//   // if workspace already exists, try refresh
//   if (!isNewWorkspace) {
//     const accessToken = await dispatch(refreshAuth0AccessToken(workspace))
//     if (accessToken) {
//       setupWorkspace(
//         dispatch,
//         {...workspace, authData: {...workspace.authData, accessToken}},
//         "connected"
//       )
//       return null
//     }
//   }
//
//   const handleLoginResult = (accessToken) => {
//     if (accessToken) {
//       setupWorkspace(
//         dispatch,
//         {...workspace, authData: {...workspace.authData, accessToken}},
//         "connected"
//       )
//     }
//
//     loginCb(false)
//   }
//   loginCb(true)
//   return await dispatch(auth0Login(workspace, handleLoginResult, true))
// }
//
// throw new Error("unknown authType")
// }
