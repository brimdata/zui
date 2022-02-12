import isEmpty from "lodash/isEmpty"
import brim, {BrimLake} from "../../brim"
import {Thunk} from "../../state/types"
import {Lake} from "../../state/Lakes/types"
import {Client} from "@brimdata/zealot"

export const buildLake = (
  l: Partial<Lake>,
  _signal: AbortSignal
): Thunk<Promise<BrimLake>> => async (_dispatch, _getState) => {
  if (!l.host || !l.id || !l.name)
    throw new Error("must provide host, id, and name to build lake")
  const zealot = new Client(brim.lake(l as Lake).getAddress())

  const lake = {...l}

  // check version to test that zqd is available, retrieve/update version while doing so
  const {version} = await zealot.version()
  lake.version = version

  // first time connection, need to determine auth type and set authData accordingly
  if (isEmpty(lake.authType)) {
    const resp = await zealot.authMethod()
    if (resp.kind === "auth0") {
      const {client_id: clientId, domain} = resp.auth0
      lake.authType = "auth0"
      lake.authData = {
        clientId,
        domain
      }
    } else {
      lake.authType = "none"
    }
  }

  return brim.lake(lake as Lake)
}
