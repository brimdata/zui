import {Client} from "@brimdata/zed-js"
import {validateToken} from "src/js/auth0/utils"
import {LakeModel} from "src/js/models/lake"
import {getAuthCredentials} from "src/js/flows/lake/getAuthCredentials"
import Current from "src/js/state/Current"
import Lakes from "src/js/state/Lakes"
import LakeStatuses from "src/js/state/LakeStatuses"
import {Thunk} from "src/js/state/types"

export const getZealot =
  (lake?: LakeModel): Thunk<Promise<Client>> =>
  async (dispatch, getState) => {
    const l = lake || Current.mustGetLake(getState())
    const auth = await dispatch(getAuthToken(l))
    return new Client(l.getAddress(), {auth})
  }

export const getAuthToken =
  (lake: LakeModel): Thunk<Promise<string>> =>
  async (dispatch) => {
    if (!lake.authType) return null
    if (lake.authType === "none") return null
    const token = lake.authData.accessToken
    if (validateToken(token)) {
      return token
    } else {
      const newToken = await dispatch(getAuthCredentials(lake))
      if (newToken) {
        dispatch(Lakes.setAccessToken({lakeId: lake.id, accessToken: newToken}))
        return newToken
      } else {
        dispatch(LakeStatuses.set(lake.id, "login-required"))
        throw new Error("Login Required")
      }
    }
  }
