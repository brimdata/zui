import {Thunk} from "../state/types"
import Current from "../state/Current"
import {Auth0Client} from "../auth0"
import Workspaces from "../state/Workspaces"

export const getAuth0 = (workspaceId?: string): Thunk<Auth0Client> => (
  dispatch,
  getState
) => {
  const ws = workspaceId
    ? Workspaces.id(workspaceId)(getState())
    : Current.mustGetWorkspace(getState())

  if (!ws.authType || ws.authType !== "auth0") return null
  if (!ws.authData) throw new Error("authData missing from workspace")

  const {clientId, domain} = ws.authData

  return new Auth0Client(clientId, domain)
}
