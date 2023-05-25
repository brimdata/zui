import {Client} from "@brimdata/zed-js"
import {syncPoolsData} from "src/app/core/pools/sync-pools-data"
import lake from "src/js/models/lake"
import {validateToken} from "../../auth0/utils"
import Lakes from "../../state/Lakes"
import LakeStatuses from "../../state/LakeStatuses"
import {getAuthCredentials} from "./getAuthCredentials"

/**
 * Updates a lakes status by trying to connect
 * @param lakeId
 */
export const updateStatus =
  (lakeId: string) =>
  async (dispatch, getState): Promise<void> => {
    const lakeModel = lake(Lakes.id(lakeId)(getState()))
    const zealot = new Client(lakeModel.getAddress())

    const activate = async () => {
      await dispatch(syncPoolsData())
      dispatch(LakeStatuses.set(lakeModel.id, "connected"))
    }

    const isDown = async () => {
      try {
        // check version to test that zqd is available, update lake version while doing so
        const {version} = await zealot.version()
        lakeModel.version = version
        return false
      } catch (e) {
        console.error(e)
        dispatch(LakeStatuses.set(lakeModel.id, "disconnected"))
        return true
      }
    }

    if (await isDown()) return

    // update version
    dispatch(Lakes.add(lakeModel.serialize()))

    // no auth required
    if (lakeModel.authType === "none") {
      activate()
      return
    }

    // auth required, if method is auth0...
    if (lakeModel.authType === "auth0") {
      // ...and we already have the token
      if (validateToken(lakeModel.authData.accessToken)) {
        activate()
        return
      }

      // otherwise, need to refresh accessToken
      const accessToken = await dispatch(getAuthCredentials(lakeModel))
      if (accessToken) {
        dispatch(Lakes.setLakeToken(lakeModel.id, accessToken))
        activate()
        return
      }

      // otherwise login is required, send user to our 'login' page and let them initiate the flow there
      dispatch(LakeStatuses.set(lakeModel.id, "login-required"))
      return
    }

    throw new Error("unknown auth type: " + lakeModel.authType)
  }
