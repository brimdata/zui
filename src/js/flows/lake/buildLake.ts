import isEmpty from "lodash/isEmpty"
import {Thunk} from "../../state/types"
import {Lake} from "../../state/Lakes/types"
import {Client} from "@brimdata/zed-js"
import lake, {LakeModel} from "src/js/models/lake"

export const buildLake =
  (l: Partial<Lake>, _signal: AbortSignal): Thunk<Promise<LakeModel>> =>
  async (_dispatch, _getState) => {
    if (!l.host || !l.id || !l.name)
      throw new Error("must provide host, id, and name to build lake")
    const zealot = new Client(lake(l as Lake).getAddress())

    const lakeData = {...l}

    // check version to test that zqd is available, retrieve/update version while doing so
    const {version} = await zealot.version()
    lakeData.version = version

    // first time connection, need to determine auth type and set authData accordingly
    if (isEmpty(lakeData.authType)) {
      const resp = await zealot.authMethod()
      if (resp.kind === "auth0") {
        const {audience, client_id: clientId, domain} = resp.auth0
        lakeData.authType = "auth0"
        lakeData.authData = {
          audience,
          clientId,
          domain,
        }
      } else {
        lakeData.authType = "none"
      }
    }

    return lake(lakeData as Lake)
  }
