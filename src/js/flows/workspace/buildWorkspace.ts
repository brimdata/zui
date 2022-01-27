import isEmpty from "lodash/isEmpty"
import brim, {BrimWorkspace} from "../../brim"
import {Thunk} from "../../state/types"
import {Lake} from "../../state/Lakes/types"
import {Client} from "@brimdata/zealot"

export const buildWorkspace = (
  ws: Partial<Lake>,
  signal: AbortSignal
): Thunk<Promise<BrimWorkspace>> => async (dispatch, getState) => {
  if (!ws.host || !ws.id || !ws.name)
    throw new Error("must provide host, id, and name to build lake")
  const zealot = new Client(brim.workspace(ws as Lake).getAddress())

  const workspace = {...ws}

  // check version to test that zqd is available, retrieve/update version while doing so
  const {version} = await zealot.version()
  workspace.version = version

  // first time connection, need to determine auth type and set authData accordingly
  if (isEmpty(workspace.authType)) {
    const resp = await zealot.authMethod()
    const authMethod = resp?.value
    if (authMethod.kind === "auth0") {
      const {client_id: clientId, domain} = authMethod.auth0
      workspace.authType = "auth0"
      workspace.authData = {
        clientId,
        domain
      }
    } else {
      workspace.authType = "none"
    }
  }

  return brim.workspace(workspace as Lake)
}
