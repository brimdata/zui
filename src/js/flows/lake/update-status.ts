import {Client} from "@brimdata/zealot"
import {syncPoolsData} from "src/app/core/pools/sync-pools-data"
import {validateToken} from "../../auth0/utils"
import brim from "../../brim"
import Lakes from "../../state/Lakes"
import LakeStatuses from "../../state/LakeStatuses"
import {getAuthCredentials} from "./getAuthCredentials"

/**
 * Updates a lakes status by trying to connect
 * @param lakeId
 */
export const updateStatus = (lakeId: string) => async (
  dispatch,
  getState
): Promise<void> => {
  const lake = brim.lake(Lakes.id(lakeId)(getState()))
  const zealot = new Client(lake.getAddress())

  const activate = async () => {
    await dispatch(syncPoolsData())
    dispatch(LakeStatuses.set(lake.id, "connected"))
  }

  const isDown = async () => {
    try {
      // check version to test that zqd is available, update lake version while doing so
      const {version} = await zealot.version()
      lake.version = version
      return false
    } catch (e) {
      console.error(e)
      dispatch(LakeStatuses.set(lake.id, "disconnected"))
      return true
    }
  }

  if (await isDown()) return

  // update version
  dispatch(Lakes.add(lake.serialize()))

  // no auth required
  if (lake.authType === "none") {
    activate()
    return
  }

  // auth required, if method is auth0...
  if (lake.authType === "auth0") {
    // ...and we already have the token
    if (validateToken(lake.authData.accessToken)) {
      activate()
      return
    }

    // otherwise, need to refresh accessToken
    const accessToken = await dispatch(getAuthCredentials(lake))
    if (accessToken) {
      dispatch(Lakes.setLakeToken(lake.id, accessToken))
      activate()
      return
    }

    // otherwise login is required, send user to our 'login' page and let them initiate the flow there
    dispatch(LakeStatuses.set(lake.id, "login-required"))
    return
  }

  throw new Error("unknown auth type: " + lake.authType)
}
