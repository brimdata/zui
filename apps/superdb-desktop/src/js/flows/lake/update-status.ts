import {Client} from "../../../../../../packages/superdb-types/dist"
import {syncPoolsData} from "src/models/sync-pools-data"
import {Lake} from "src/models/lake"
import {validateToken} from "../../../core/auth0/utils"
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
    const lakeModel = new Lake(Lakes.id(lakeId)(getState()))
    const zealot = new Client(lakeModel.getAddress())

    const activate = async () => {
      await dispatch(syncPoolsData())
      dispatch(LakeStatuses.set(lakeModel.id, "connected"))
    }

    const isDown = async () => {
      try {
        // check version to test that zqd is available, update lake version while doing so
        const {version} = await zealot.version()
        lakeModel.update({version})
        return false
      } catch (e) {
        console.error(e)
        dispatch(LakeStatuses.set(lakeModel.id, "disconnected"))
        return true
      }
    }

    if (await isDown()) return

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
        dispatch(Lakes.setAccessToken({lakeId: lakeModel.id, accessToken}))
        activate()
        return
      }

      // otherwise login is required, send user to our 'login' page and let them initiate the flow there
      dispatch(LakeStatuses.set(lakeModel.id, "login-required"))
      return
    }

    throw new Error("unknown auth type: " + lakeModel.authType)
  }
