import {Thunk} from "../state/types"
import Current from "../state/Current"
import {Auth0Client} from "../auth0"
import {Workspace} from "../state/Workspaces/types"

export const getAuth0 = (ws?: Workspace): Thunk<Auth0Client> => (
  dispatch,
  getState
) => {
  if (!ws) ws = Current.getWorkspace(getState())
  if (!ws.authType || ws.authType !== "auth0") return null
  if (!ws.authData) throw new Error("authData missing from workspace")

  const {clientId, domain} = ws.authData

  return new Auth0Client(clientId, domain)
}
